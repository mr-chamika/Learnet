import { useContext, useEffect, useState } from "../../../react_lite/createDOM"
import img from "../../Assets/grp.jpg"
import { UserContext } from "../../Contexts/UserContext"
import { getTimeDate } from "../../Util/TimeDate"
import "./MessageBox.css"
import fileIcon from "../../Assets/icons/PersonalFolder/file.png"
import downloadIcon from "../../Assets/icons/download.png"

const MessageBox = ({name, message, type, messageData, otherUsers, prevMessageType}) => {

    const {user} = useContext(UserContext)

    let className, user2
    if(type === "chat"){
        // const className = `message-box ${type == "send" ? "send" : "receive"}`
        className = `message-box ${ user.userId === messageData.userId1 ? "send" : "receive"}`
        // console.log("class name : ", className)
        let userId2 = null
        if(user.userId === messageData.userId1){
            userId2 = messageData.userId2
        }else{
            userId2 = messageData.userId1
        }
    
        user2 = otherUsers[userId2]
    }else{
        className = `message-box ${ user.userId === messageData.senderId ? "send" : "receive"}`
        user2 = otherUsers[messageData.senderId]
    }

    const currentMessageType = className.split(" ")[1].trim()
    // console.log("type : ", prevMessageType)
    let showRect
    if(prevMessageType){
        if(type === "chat"){
            showRect = currentMessageType !== prevMessageType.current.type
            prevMessageType.current.type = currentMessageType
        }else{
            showRect = currentMessageType !== prevMessageType.current.type.type ||
                        user2._id !== prevMessageType.current.type.sender
            prevMessageType.current.type.type = currentMessageType
            prevMessageType.current.type.sender = user2._id
        }
    }

    // const time = (new Date(messageData.timestamp)).toUTCString()
    const time = getTimeDate(messageData.timestamp)[1]

    // console.log("message box : ", messageData, type, otherUsers)

    const messageType = messageData.type
    switch(messageType){
        case "update": 
            let message = messageData.message 
            let index = -1
            while((index = message.indexOf("<userId>")) >= 0){
                const id = message.slice(index + 8, index + 32)
                const user = otherUsers[id]
                message = message.replace("<userId>"+id, user.name)
            }
            messageData.message = message
            break
    }

    className += " " + messageData.type

    if(messageData.type === "update"){
        return (
            <div className={className}>
                {messageData.message}
            </div>
        );
    }

    console.log(messageData)

    const [files, setFiles] = useState({})
    useEffect(()=>{
        if(messageData.fileIds){
            messageData.fileIds.map(fileId=>{
                fetch("http://localhost:8080/file/get-info", {
                    method: "POST",
                    headers: {
                        authorization: `bearer ${user.token}`
                    },
                    body: JSON.stringify({
                        fileId
                    })
                })
                .then(res=>res.json())
                .then(data=>{
                    console.log("shared file info : ", data)
                    if(!data.error){
                        setFiles(prev=>{
                            return {...prev, [fileId]: data}
                        })
                    }
                })
            })
        }
    }, [messageData.fileIds])

    console.log("file info : ", files)

    const fileDownloadHandler = (fileId) => {
        fetch("http://localhost:8080/file/get",{
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({
                fileId
            })
        })
        .then(res=>res.blob())
        .then(blob=>{
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = files[fileId].name || Date.now()
            a.style.display = "none"
            document.body.appendChild(a)
            a.click()
            URL.revokeObjectURL(blob)
            document.body.removeChild(a)
        })
    }

    return ( 
        <div className={`${className} ${showRect ? "show-rect" : ""}`}>
            {messageData.senderId !== user.userId && (<div className="profile-pic">{type !== "chat" && showRect && (<img src={img} alt="" />)}</div>)}
            <div className={"text"}>
                {type !== "chat" && showRect && (<div className="name">{user2?.name}</div>)}
                <div className="text-bottom">
                    <div className="message">{messageData.message}</div>
                    <div className="time">{time}</div>
                </div>
                {messageData.fileIds && messageData.fileIds.length > 0 && (
                    <div className="attachments-list">
                        {messageData.fileIds.map((fileId, index) => (
                            <div key={`${fileId}-${index}`} className="attachment-item">
                                { files[fileId] ?
                                    (
                                        <span className="file-name">
                                            <img src={fileIcon} />
                                            <span>{files[fileId].name}</span>
                                            <img onClick={()=>fileDownloadHandler(fileId)} src={downloadIcon} />
                                        </span>
                                    ):
                                    (
                                        <span className="file-name">
                                            Loading...
                                        </span>
                                    )
                                }
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
     );
}
 
export default MessageBox;