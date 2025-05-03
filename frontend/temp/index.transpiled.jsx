import { useContext } from "../../../react_lite/createDOM"
import img from "../../Assets/grp.jpg"
import { UserContext } from "../../Contexts/UserContext"
import "./MessageBox.css"

const MessageBox = ({name, message, type, messageData, otherUsers}) => {

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

    const time = (new Date(messageData.timestamp)).toUTCString()

    console.log("message box : ", messageData, type, otherUsers)

    const messageType = messageData.type
    switch(messageType){
        case "update": 
            let message = messageData.message 
            let index = -1

            messageData.message = message
            break
    }

    className += " " + messageData.type

    const x = [1, 2, 3, 4, 5]
    const y = "a"

    function test(a, b, c){
        console.log(a, b, c)
    }

    return {"type":"div","props":{"className":className,"id":y === 'a' ? 1234 : x[0] === 100 ? '500' : '100',"onClick":(e)=>test(100, 200, 300)},"children":[{"type":"EXPRESSION","props":{},"children":()=>{return y == 'a' ? ({'type':'div','props':{},'children':[{'type':'TEXT_ELEMENT','props':{},'children':'test'}]}) : ({'type':'div','props':{},'children':[{'type':'TEXT_ELEMENT','props':{},'children':'test2'}]})}},{"type":"EXPRESSION","props":{},"children":()=>{return messageData.type !== 'update' && ({'type':'div','props':{'className':'profile-pic'},'children':[{'type':'EXPRESSION','props':{},'children':()=>{return type !== 'chat' && ({'type':'img','props':{'src':img,'alt':''},'children':null})}}]})}},{"type":"EXPRESSION","props":{},"children":()=>{return x.map(v=>{                    return (                        {'type':'div','props':{'className':'hello-world'},'children':[{'type':'EXPRESSION','props':{},'children':()=>{return y == 'a' ? ({'type':'div','props':{},'children':[{'type':'TEXT_ELEMENT','props':{},'children':'test'}]}) : ({'type':'div','props':{},'children':[{'type':'TEXT_ELEMENT','props':{},'children':'test2'}]})}}]}                    )                })}}]}
}
 
export default MessageBox;