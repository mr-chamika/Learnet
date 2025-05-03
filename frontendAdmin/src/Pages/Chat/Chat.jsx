import ChatBox from "../../Components/ChatBox/ChatBox"
import MessageBox from "../../Components/MessageBox/MessageBox";

import "./Chat.css"
import Topbar from "./Topbar/Topbar";
import groupImg from "../../Assets/grp.jpg"
import PopupBox from "../../Components/PopupBox/PopupBox";
import NewChatForm from "./NewChatForm/NewChatForm";
import NewGroupForm from "./NewGroupForm/NewGroupForm";
import NewCommunityForm from "./NewCommunityForm/NewcommunityForm";
import { useContext, useEffect, useLayoutEffect, useReducer, useState } from "../../../react_lite/createDOM";
import { UserContext } from "../../Contexts/UserContext";
import { otherUsersContext } from "../../Contexts/OtherUsersContext";
import { formDataToObj } from "../../Util/FormDataToObj";

const Chat = () => {

    const k = [1,2,3,4,5]
    // const chats = [
    //     {
    //         type: "group",
    //         name: "Group project",
    //         messageCount: 7,
    //         lastMessage: "last message",
    //         sender: "Isumee",
    //     },
    //     {
    //         type: "personal",
    //         name: "Hirun",
    //         messageCount: 3,
    //         lastMessage: "last message",
    //         sender: "Chamila",
    //     },
    //     {
    //         type: "personal",
    //         name: "Chamika",
    //         messageCount: 10,
    //         lastMessage: "Learnet forum",
    //         sender: "Chamika",
    //     },
    // ]

    const {user} = useContext(UserContext)
    const [otherUsers, setOtherUsers] = useState({})
    const token = user.token

    function messagesReducer(state, action){
        
        switch(action.type){
            case "add/update":
                return {...state, [action.payload.chatId]: action.payload.messages}
            case "addToChat":
                state[action.payload.chatId].unreadMessageList.push(action.payload.message)
                return {...state}
            default: 
                return state
            
        }
    }

    const [messagesList, messagesListDispatch] = useReducer(messagesReducer, {})
    // const [unreadMessageList, setUnreadMessageList] = useState([])
    // const [messageList, setMessageList] = useState([])

    const [socket, setSocket] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([])
    const [inputMessage, setInputMessage] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');

    function scrollToBottomOfMessages(){
        // console.log("last element _________-- : ", document.querySelector(".chat .message-box:last-child"))
        const msgcont = document.querySelector(".chat .messages")
        // const lastMessage = msgcont.children[msgcont.childElementCount - 3]
        // lastMessage.scrollIntoView(false)
        msgcont.scrollTop = msgcont.scrollHeight
    }

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:5000');
    
        ws.onopen = () => {
          console.log('Connected to WebSocket server');
    
          // Send the JWT token for authentication
            //   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZ20iLCJlbWFpbCI6ImdtZ2dnQGdtYWlsLmNvbSIsImlhdCI6MTcyNzA4OTA3MCwiZXhwIjoxNzI3MTc1NDcwfQ.0k1DPkeWxaz589vwGLrP62XUQ-yR9mKMnnDPLlPf0iU'; // Replace with actual token
            ws.send(JSON.stringify({type: "token", data: token}));
        };
    
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
    
          switch (data.type) {
            case 'success':
              console.log('Authentication successful');
              setAuthenticated(true);
              break;
            case 'error':
              console.error('Error:', data.message);
              break;
            case 'info':
              console.log('Info:', data.message);
              break;
            case 'message':
                // Update the chat UI with the new message
                //   setMessages((prevMessages) => [
                //     ...prevMessages,
                //     {
                //       sender: data.sender,
                //       content: data.content,
                //       timestamp: data.timestamp,
                //     },
                //   ]);
                // console.log("new message received : ", data.data)
                messagesListDispatch({type: "addToChat", payload: {chatId: data.data.chatId, message: data.data.message}})

                scrollToBottomOfMessages()


                break;
            case "ChatList":
                setChats(data.data)
                // console.log("chat list : ", data.data)
                const userIdSet = new Set(data.data.flatMap(chat=>[chat.userId1, chat.userId2]))
                const userIds = [...userIdSet]
                // console.log("user ID : ", data.data[0].userId2)
                fetch("http://localhost:8080/user/get", {
                    method: "POST",
                    headers: {
                        authorization: `bearer ${user.token}`
                    },
                    body: JSON.stringify({userIds})
                })
                .then(res=>res.json())
                .then(data=>{
                    if(!data.error){
                        const usersData = {}
                        const uids = data.map(userDetails=>userDetails._id)
                        for(let i = 0; i < uids.length; i++){
                            usersData[uids[i]] = data[i]
                        }
                        // console.log("user data : ", usersData)
                        setOtherUsers(usersData)
                    }else{
                        console.log(data.error)
                    }
                })
                .catch(err=>console.log(err))
                break
            case "chatMessages": 
                // console.log("messages : ", data)
                // console.log("unread list : ", data.data.unreadMessageList)
                // setMessageList(data.data.messageList)
                // setUnreadMessageList(data.data.unreadMessageList)

                
                messagesListDispatch({type: "add/update", payload: {chatId: data.data.chatId, messages: data.data}})
                break
            case "chat":
                console.log("chat received : ", data)
                setChats(prev=>{
                    const index = prev.findIndex(chat=>chat._id === data.data._id)
                    if(index){
                        prev[index] = data.data
                    }else{
                        prev.push(data.data)
                    }
                    return [...prev]
                })
                break
            default:
              console.log('Unknown message type:', data.type);
          }
        };
    
        ws.onclose = () => {
          console.log('WebSocket connection closed');
        };
    
        ws.onerror = (err) => {
          console.error('WebSocket error:', err);
        };
    
        setSocket(ws);
    
        // Clean up the WebSocket connection when the component unmounts
        return () => {
          if (ws) {
            ws.close();
          }
        };
      }, []);

    // const messages = {
    //     "Group project": [
    //         {
    //             name: "Chathura",
    //             message: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, eligendi. Autem quam non similique voluptatum perferendis odio ducimus voluptates. Quam quidem fuga vero impedit dolorem exercitationem similique voluptates temporibus! Quibusdam.",
    //             time: "11.52",
    //             type: "receive",
    //         },
    //         {
    //             name: "Hirun",
    //             message: "Autem quam non similique voluptatum perferendis odio ducimus voluptates.",
    //             time: "11.52",
    //             type: "receive",
    //         },
    //         {
    //             name: "You",
    //             message: "Quam quidem fuga vero impedit dolorem exercitationem similique voluptates temporibus! Quibusdam.",
    //             time: "11.52",
    //             type: "send",
    //         },
    //         {
    //             name: "Isumee",
    //             message: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
    //             time: "11.53",
    //             type: "receive",
    //         }
    //     ],
    //     "Hirun": [
    //         {
    //             name: "Hirun",
    //             message: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
    //             time: "15.32",
    //             type: "receive",
    //         }
    //     ],
    //     "Chamika": [
    //         {
    //             name: "Chamika",
    //             message: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
    //             time: "10.00",
    //             type: "receive",
    //         }
    //     ],
    // }

    const [currentChat, setCurrentChat] = useState(null)

    function changeChat(newChat){

        const friendId = user.userId === newChat.userId1 ? newChat.userId2 : newChat.userId1

        socket.send(JSON.stringify({
            type: "chat",
            data: {
                senderUserId: friendId
            }
        }))

        setCurrentChat(newChat)
    }

    function sendMessage(e){
        e.preventDefault();
        const formData = new FormData(e.target)
        const data = formDataToObj(formData)

        console.log("data : ", data)

        socket.send(JSON.stringify({
            type: "message",
            data: {
                receiverUserId: user.userId === currentChat.userId1 ? currentChat.userId2 : currentChat.userId1,
                message: data.message
            }
        }))

        e.target.reset()
    }

    // console.log("unread message list :", unreadMessageList)

    const messageList = messagesList[currentChat?._id]?.messageList
    const unreadMessageList = messagesList[currentChat?._id]?.unreadMessageList

    // console.log("current chat : ", currentChat?._id)
    // console.log("messages : ", messagesList[currentChat?._id])
    // console.log("message List : ", messageList)
    // console.log("message List : ", unreadMessageList)

    useLayoutEffect((element)=>{
        const msgcont = element.querySelector(".messages")
        if(msgcont){
            msgcont.scrollTop = msgcont.scrollHeight
        }
    })
    
    return ( 
        <div className="chat">
            <Topbar />
            <PopupBox className="new-chat">
                <NewChatForm />
            </PopupBox>
            <PopupBox className="new-group">
                <NewGroupForm />
            </PopupBox>
            <PopupBox className="new-community">
                <NewCommunityForm />
            </PopupBox>
            <div className="bottom">
                <div className="left-pannel">
                    {
                        chats && chats.length > 0 && chats.map((v, i)=>{
                            return (
                                <ChatBox 
                                    key={i}
                                    chatDetails={v}
                                    setCurrent={changeChat}
                                    otherUsers={otherUsers}
                                />
                            )
                        })
                    }
                </div>
                <div className="right">
                    <div className="user-group-details">
                        <div className="left">
                            <div className="user-group-img">
                                <img src={groupImg} alt="" />
                            </div>
                            <div className="text">
                                <div className="user-group-name">{currentChat}</div>
                                <div className="group-members-list">member1, member2, ...</div>
                            </div>
                        </div>
                        <div className="right">
                            <div className="menu">
                                menu
                            </div>
                        </div>
                    </div>
                    <div className="messages">
                        {
                            messageList && messageList.length > 0 && messageList.map((message, index) => {
                                return (
                                    <MessageBox 
                                        messageData={message}
                                        otherUsers={otherUsers}
                                    />
                                )
                            })
                        }
                        {
                            unreadMessageList && unreadMessageList.length > 0 && unreadMessageList.map((message, index) => {
                                return (
                                    <MessageBox 
                                        messageData={message}
                                        otherUsers={otherUsers}
                                    />
                                )
                            })
                        }
                        {/* {
                            messages && messages.length > 0 && messages[currentChat].map((message, index) => {
                                return (
                                    <MessageBox 
                                        name={message.name}
                                        message={message.message}
                                        time={message.time}
                                        type={message.type}
                                    />
                                )
                            })
                        } */}
                        {/* <MessageBox 
                            name="Chathura"
                            message="Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, eligendi. Autem quam non similique voluptatum perferendis odio ducimus voluptates. Quam quidem fuga vero impedit dolorem exercitationem similique voluptates temporibus! Quibusdam."
                            time="11.52"
                            type="receive"
                        />
                        <MessageBox 
                            name="Chathura"
                            message="Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, eligendi. Autem quam non similique voluptatum perferendis odio ducimus voluptates. Quam quidem fuga vero impedit dolorem exercitationem similique voluptates temporibus! Quibusdam."
                            time="11.52"
                            type="send"
                        />
                        <MessageBox 
                            name="Chathura"
                            message="Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, eligendi. Autem quam non similique voluptatum perferendis odio ducimus voluptates. Quam quidem fuga vero impedit dolorem exercitationem similique voluptates temporibus! Quibusdam."
                            time="11.52"
                            type="send"
                        />
                        <MessageBox 
                            name="Chathura"
                            message="Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, eligendi. Autem quam non similique voluptatum perferendis odio ducimus voluptates. Quam quidem fuga vero impedit dolorem exercitationem similique voluptates temporibus! Quibusdam."
                            time="11.52"
                            type="receive"
                        />
                        <MessageBox 
                            name="Chathura"
                            message="Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, eligendi. Autem quam non similique voluptatum perferendis odio ducimus voluptates. Quam quidem fuga vero impedit dolorem exercitationem similique voluptates temporibus! Quibusdam."
                            time="11.52"
                            type="receive"
                        />
                        <MessageBox 
                            name="Chathura"
                            message="Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, eligendi. Autem quam non similique voluptatum perferendis odio ducimus voluptates. Quam quidem fuga vero impedit dolorem exercitationem similique voluptates temporibus! Quibusdam."
                            time="11.52"
                            type="receive"
                        /> */}
                        <div className="padding"></div>
                        <div className="input">
                            <form onSubmit={sendMessage}>
                                <input type="text" name="message" value="" placeholder="Enter your message here" />
                                <input type="submit" name="submit" value="send"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Chat;