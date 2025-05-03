import { useContext } from "../../../react_lite/createDOM"
import img from "../../Assets/grp.jpg"
import { UserContext } from "../../Contexts/UserContext"
import "./ChatBox.css"

const ChatBox = ({type, name, description, messageCount, lastMessage, sender, setCurrent, chatDetails, otherUsers}) => {

    const {user} = useContext(UserContext)

    const user2Id = chatDetails.userId1 === user.userId ? chatDetails.userId2 : chatDetails.userId1

    type = chatDetails.type
    name = otherUsers[user2Id]?.name
    // description = chatDetails
    // console.log(user.userId, chatDetails.senderId)
    messageCount = user.userId !=  chatDetails.senderId ? chatDetails.unreadMessageCount : null
    lastMessage = chatDetails.lastMessage
    sender = otherUsers[chatDetails.senderId]

    return ( 
        <div className="chat-box" onClick={()=>setCurrent && setCurrent(chatDetails)}>
            <div className="img"><img src={img} alt="" /></div>
            <div className="right">
                <div className="text">
                    <div className="name">
                        {name}
                    </div>
                    <div className="last-message">
                        {type === "group" && (<div className="sender">{sender}:</div>)}{lastMessage && (<div className="message">{lastMessage}</div>)}
                    </div>
                    {description && (<div className="description">{description}</div>)}
                </div>
                {messageCount && (<div className="message-count">{messageCount}</div>)}
            </div>
        </div>
     );
}
 
export default ChatBox;