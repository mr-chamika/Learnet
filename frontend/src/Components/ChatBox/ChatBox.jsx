import { useContext, useEffect, useState } from "../../../react_lite/createDOM"
import img from "../../Assets/grp.jpg"
import { UserContext } from "../../Contexts/UserContext"
import "./ChatBox.css"
import arrowIcon from "../../Assets/icons/arrow.svg"
import { getTimeDate } from "../../Util/TimeDate"

// const ChatBox = ({type, name, description, messageCount, lastMessage, sender, setCurrent, chatDetails, otherUsers}) => {
const ChatBox = ({currentChat, onContext, setCurrent, chatDetails, otherUsers}) => {

    const {user} = useContext(UserContext)
    const [groupImage, setGroupImage] = useState(img)

    const user2Id = chatDetails.userId1 === user.userId ? chatDetails.userId2 : chatDetails.userId1

    useEffect(()=>{
        if(chatDetails.groupImage || chatDetails.communityImage){
            fetch("http://localhost:8080/chatimage/get", {
                method: "POST",
                headers: {
                    authorization: `bearer ${user.token}`
                },
                body: JSON.stringify({
                    fileId: chatDetails.groupImage || chatDetails.communityImage
                })
            })
            .then(res=>res.blob())
            .then(blob=>{
                console.log("group image received : ", blob)
                const url = URL.createObjectURL(blob)
                setGroupImage(url)
            })
        }
    }, [chatDetails])

    const type = chatDetails.type
    let name, description, messageCount, lastMessage, lastMessageType, sender, at, image, chatImage
    if(type == "chat"){
        name = otherUsers[user2Id]?.name
        // description = chatDetails
        // console.log(user.userId, chatDetails.senderId)
        messageCount = user.userId !=  chatDetails.senderId ? chatDetails.unreadMessageCount : null
        lastMessage = chatDetails.lastMessage
        lastMessageType = chatDetails.lastMessageType
        // console.log("last message : ", lastMessage)
        if(lastMessageType === "update"){
            let message = lastMessage
            let index = -1
            while((index = message.indexOf("<userId>")) >= 0){
                const id = message.slice(index + 8, index + 32)
                const user = otherUsers[id]
                if(user){
                    message = message.replace("<userId>"+id, user.name)
                }
            }
            lastMessage = message
            // console.log("last message message : ", message)
        }

        chatImage = otherUsers[user2Id]?.profilePicture || img

        const lmTD = getTimeDate(chatDetails.lastMessageTimestamp)
        const nTD = getTimeDate(Date.now())
        if(lmTD[0] == nTD[0]){
            at = lmTD[1]
        }else{
            at = lmTD[0]
        }

        if(chatDetails.senderId === user.userId){
            sender = "you"
        }else{
            sender = otherUsers[chatDetails.senderId]
        }
    }else if(type == "group"){
        // console.log("type : ", chatDetails)
        name = chatDetails.name
        lastMessage = chatDetails.lastMessage
        lastMessageType = chatDetails.lastMessageType

        if(lastMessageType === "update"){
            let message = lastMessage
            let index = -1
            while((index = message.indexOf("<userId>")) >= 0){
                const id = message.slice(index + 8, index + 32)
                const user = otherUsers[id]
                if(user){
                    message = message.replace("<userId>"+id, user.name)
                }
            }
            lastMessage = message
        }

        chatImage = groupImage

        if(chatDetails.lastMessageTimestamp){
            const lmTD = getTimeDate(chatDetails.lastMessageTimestamp)
            const nTD = getTimeDate(Date.now())
            if(lmTD[0] == nTD[0]){
                at = lmTD[1]
            }else{
                at = lmTD[0]
            }
        }else{
            at = ""
        }
        if(chatDetails.senderId === user.userId){
            sender = {name: "you"}
        }else{
            sender = otherUsers[chatDetails.senderId]
            // console.log("kkkkkkkkk : ", sender, otherUsers, chatDetails.senderId)
        }
        messageCount = chatDetails.unreadMessageCount
    }else if(type == "community"){
        name = chatDetails.name
        messageCount = 0
        chatDetails.groups.forEach(group=>{
            messageCount += group.unreadMessageCount
        })

        chatImage = groupImage

        console.log("community : ", chatDetails)
    }

    const subGroupSetCurrent = (chatDetails, type, e) => {
        e.stopPropagation()
        setCurrent(chatDetails, type)
    }

    const [collapsed, setCollapsed] = useState(true)
    const toggle = (e) => {
        e.stopPropagation()
        setCollapsed(prev => !prev)
    }

    const isActive = currentChat?.chat._id === chatDetails._id ? true : false
    let allGroups
    if(chatDetails.type === "community"){
        allGroups = Array(...chatDetails.groups, ...chatDetails.otherGroups)
        console.log("all groups : ", allGroups)
    }else{
        allGroups = chatDetails.groups
    }

    return ( 
        <div className={isActive ? "chat-box active" : "chat-box"} onClick={(e)=>setCurrent && setCurrent(chatDetails, type, e)} onContextMenu={onContext}>
            <div className="chat-box-details">
                <div className="img"><img src={chatImage} alt="" /></div>
                <div className="right">
                    <div className="text">
                        <div className="name">
                            {name}
                        </div>
                        {messageCount && (<div className="message-count">{messageCount}</div>)}
                        {/* {description && (<div className="description">{description}</div>)} */}
                    </div>
                    {
                        chatDetails.requestToJoin ? (
                            <div className="request-to-join">
                                request to join
                            </div>
                        ):(
                            <div className="text">
                                <div className="last-message">
                                    {type === "group" && (<div className="sender">{sender?.name}:</div>)}{lastMessage && (<div className="message">{lastMessage}</div>)}
                                </div>
                                {at && (<div className="time">{at}</div>)}
                            </div>
                        )
                    }
                </div>
                {chatDetails.type === "community" && (<button className={`collapse-icon-button ${collapsed ? "collapsed" : "open"}`} onClick={(e)=>toggle(e)}><img src={arrowIcon} /></button>)}
            </div>
            <div className={collapsed == true ? "sub-groups collapsed" : "sub-groups"}>
                {
                    chatDetails.type === "community" && allGroups.map((group, index)=>{
                        return (
                            <div className="sub-chat-box-container">
                                <ChatBox setCurrent={subGroupSetCurrent} chatDetails={group} otherUsers={otherUsers} key={index}/>
                            </div>
                        )
                    })
                }
            </div>
        </div>
     );
}
 
export default ChatBox;