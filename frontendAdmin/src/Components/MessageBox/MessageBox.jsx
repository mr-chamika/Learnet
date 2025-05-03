import { useContext } from "../../../react_lite/createDOM"
import img from "../../Assets/grp.jpg"
import { UserContext } from "../../Contexts/UserContext"
import "./MessageBox.css"

const MessageBox = ({name, message, time, type, messageData, otherUsers}) => {

    const {user} = useContext(UserContext)

    // const className = `message-box ${type == "send" ? "send" : "receive"}`
    const className = `message-box ${ user.userId === messageData.userId1 ? "send" : "receive"}`
    // console.log("class name : ", className)
    let userId2 = null
    if(user.userId === messageData.userId1){
        userId2 = messageData.userId2
    }else{
        userId2 = messageData.userId1
    }

    const user2 = otherUsers[userId2]

    return ( 
        <div className={className}>
            <div className="profile-pic"><img src={img} alt="" /></div>
            <div className="text">
                <div className="name">{user2.name}</div>
                <div className="message">{messageData.message}</div>
                <div className="time">{messageData.timestamp}</div>
            </div>
        </div>
     );
}
 
export default MessageBox;