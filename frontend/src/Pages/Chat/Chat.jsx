import ChatBox from "../../Components/ChatBox/ChatBox"
import MessageBox from "../../Components/MessageBox/MessageBox";

import "./Chat.css"
import Topbar from "./Topbar/Topbar";
import groupImg from "../../Assets/grp.jpg"
import PopupBox, { openPopup } from "../../Components/PopupBox/PopupBox";
import NewChatForm from "./NewChatForm/NewChatForm";
import NewGroupForm from "./NewGroupForm/NewGroupForm";
import NewCommunityForm from "./NewCommunityForm/NewcommunityForm";
import { useContext, useEffect, useLayoutEffect, useReducer, useRef, useState } from "../../../react_lite/createDOM";
import { UserContext } from "../../Contexts/UserContext";
import { otherUsersContext } from "../../Contexts/OtherUsersContext";
import { formDataToObj } from "../../Util/FormDataToObj";

import menuIcon from "../../Assets/icons/menu.svg"
import filterIcon from "../../Assets/icons/filter.svg"
import editIcon from "../../Assets/icons/edit.svg"
import ContextMenuContainer from "../../Components/ContextMenu/ContextMenuContainer";
import ChatDetails from "./ChatDetails/ChatDetails";
import ChatInputBox from "./ChatInputBox/ChatInputBox";
import { getTimeDate } from "../../Util/TimeDate";
import { NotificationsContext } from "../../Contexts/NotificationsContext";
import chatSelectImg from "../../Assets/arts/chatselect2.png"
import detailsImg from "../../Assets/arts/pfdetails.jpg"
import { routerContext } from "../../Router/Router";
import { isAuthorized } from "../../Util/Auth";
import AddMembersForm from "./AddMembersForm/AddMembersForm";

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

    const [currentChat, setCurrentChat] = useState(null)
    const [currentMemberBox, setCurrentMemberBox] = useState(null)
    const {user} = useContext(UserContext)
    const {goto} = useContext(routerContext)
    // console.log("user : ", user)
    const {users, setUsers, fetchUsersIfNotExist} = useContext(otherUsersContext)
    const {addNotification} = useContext(NotificationsContext)
    const otherUsers = users

    const [messagesList, messagesListDispatch] = useReducer(messagesReducer, {})
    // const [unreadMessageList, setUnreadMessageList] = useState([])
    // const [messageList, setMessageList] = useState([])

    const [socket, setSocket] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([])
    const [groups, setGroups] = useState([])
    const [communities, setCommunities] = useState([])
    const [inputMessage, setInputMessage] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    // useEffect(()=>{
    //     setUsers(prev=>{
    //         return {...prev, [user.userId]: user}
    //     })
    // }, [])
    // const [otherUsers, setOtherUsers] = useState({})
    const token = user.token

    function messagesReducer(state, action){
        
        const chatId = action.payload.chatId
        
        switch(action.type){
            case "add/update":
                const messages = action.payload.messages
                return {...state, [chatId]: messages}
            case "addToChat":
                if(state[chatId]){
                    const message = action.payload.message
                    if(state[chatId].unreadMessageList.length === 0 && action.payload.isRead){
                        state[chatId].messageList.push(message)
                    }else{
                        state[chatId].unreadMessageList.push(message)
                    }
                }else{
                    // TODO : 
                }
                return {...state}
            case "resetUnreadMessages":
                if(state[chatId]){
                    state[chatId].messageList.push(...state[chatId].unreadMessageList)
                    state[chatId].unreadMessageList = []
                }
            default: 
                return state
            
        }
    }


    function scrollToBottomOfMessages(){
        // console.log("last element _________-- : ", document.querySelector(".chat .message-box:last-child"))
        const msgcont = document.querySelector(".chat .messages")
        // const lastMessage = msgcont.children[msgcont.childElementCount - 3]
        // lastMessage.scrollIntoView(false)
        if(msgcont){
            msgcont.scrollTop = msgcont.scrollHeight
        }
    }

    function scrollToTopOfUnreadMessages(){
        // console.log("last element _________-- : ", document.querySelector(".chat .message-box:last-child"))
        const msgcont = document.querySelector(".chat .messages")
        const unreadMsgCont = document.querySelector(".chat .read-messages")
        // const lastMessage = msgcont.children[msgcont.childElementCount - 3]
        // lastMessage.scrollIntoView(false)
        if(msgcont){
            msgcont.scrollTop = unreadMsgCont.scrollHeight
        }
    }

    // console.log("chat list : ", chats)
    // console.log("current chat : ", currentChat)

    useEffect(()=>{
        if(currentChat && currentChat.type === "chat"){
            const currentChatUpdated = chats.find(chat=>chat._id === currentChat.chat._id)
            setCurrentChat(prev=>{
                prev.chat = currentChatUpdated
                return {...prev}
            })
        }
    }, [chats])

    useEffect(()=>{
        if(currentChat && currentChat.type === "group"){
            const currentGroupUpdated = groups.find(group=>group._id === currentChat.chat._id)
            setCurrentChat(prev=>{
                prev.chat = currentGroupUpdated
                return {...prev}
            })
        }
    }, [groups])

    useEffect(()=>{
        if(currentChat && currentChat.type === "community"){
            const currentCommunityUpdated = communities.find(community=>community._id === currentChat.chat._id)
            console.log("updating the community details...", currentCommunityUpdated, communities)
            setCurrentChat(prev=>{
                prev.chat = currentCommunityUpdated
                return prev
            })
            // setCurrentChat({type: "community", chat: currentCommunityUpdated})
        }
    }, [communities])

    console.log("communities : ", communities)

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
                console.log("new message received : ", data.data)
                addNotification("NEW MESSAGE RECEIVED")
                const chatId = data.data.chatId
                const message = data.data.message
                const chatType = data.data.chatType

                const updatedChatInfo = {
                    lastMessage: message.message,
                    lastMessageType: message.type,
                    lastMessageTimestamp: message.timestamp,
                    // senderId
                    unreadMessageCount: 0
                }

                
                setCurrentChat(currentChat=>{

                    const chatIsCurrentlyOpen = currentChat?.chat._id === chatId
                    // console.log("current chat : gg ", currentChat, currentChat?.chat._id, chatId, chatIsCurrentlyOpen)

                    let isNotLastMessageSender
                    let senderId
                    // console.log("chat type : ", chatType)
                    if(chatType == "chat"){
                        isNotLastMessageSender = message.userId1 !== user.userId
                        senderId = message.userId1
                    }else if(chatType == "group"){
                        isNotLastMessageSender = message.senderId !== user.userId
                        senderId = message.senderId
                    }

                    console.log("message : ", senderId, message.senderId)

                    // console.log("isNotLastMessageSender: ", isNotLastMessageSender, user.userId, message.userId1)

                    const isRead = chatIsCurrentlyOpen
                    // console.log("isRead: ", isRead, chatIsCurrentlyOpen, isNotLastMessageSender)
                    messagesListDispatch({type: "addToChat", payload: {chatId, message, chatType, isRead}})
                    
                    if(chatIsCurrentlyOpen && isNotLastMessageSender){
                        if(currentChat.type == "group"){
                            ws.send(JSON.stringify({
                                type: "group-message-received",
                                data: {
                                    groupId: chatId
                                }
                            }))
                        }else if(currentChat.type == "chat"){
                            // console.log("message.senderId !== user.userId: ", message, user.userId, message.senderId !== user.userId)
                            if(message.userId1 !== user.userId){
                                const senderUserId = user.userId === message.userId1 ? message.userId2 : message.userId1
                                ws.send(JSON.stringify({
                                    type: "message-received",
                                    data: {
                                        senderUserId
                                    }
                                }))
                            }
                        }
                    }

                    // console.log("prev cur chat : ", currentChat)

                    if(chatType == "chat"){
                        setChats(prev=>{
                            const index = prev.findIndex(chat=>chat._id === chatId)
                            // console.log("chat : ", prev)
                            if(isNotLastMessageSender && !chatIsCurrentlyOpen){
                                updatedChatInfo.unreadMessageCount = prev[index].unreadMessageCount + 1
                            }
                            updatedChatInfo.senderId = message.userId1
                            // console.log("updated chat info : ", updatedChatInfo)
                            prev[index] = {...prev[index], ...updatedChatInfo}
                            // console.log("chat 2 : ", prev)
                            return [...prev]
                        })
                    }else if(chatType == "group"){
                        setGroups(prev=>{
                            const index = prev.findIndex(group=>group._id === chatId)
                            if(isNotLastMessageSender && !chatIsCurrentlyOpen){
                                updatedChatInfo.unreadMessageCount = prev[index].unreadMessageCount + 1
                            }
                            updatedChatInfo.senderId = senderId
                            // console.log("updated chat info : ", updatedChatInfo)
                            prev[index] = {...prev[index], ...updatedChatInfo}
                            console.log("prev groups : ", prev)
                            return [...prev]
                        })
                    }
                    // console.log("updated cur chat : ", currentChat)


                    return currentChat
                })
                scrollToBottomOfMessages()


                break;
            case "ChatList":
                data.data = data.data.map(chat => {chat.type = "chat";  return chat})
                setChats(data.data)
                // console.log("chat list : ", data.data)
                const userIdSet = new Set(data.data.flatMap(chat=>[chat.userId1, chat.userId2]))
                const userIds = [...userIdSet]
                // console.log("user ID : ", data.data[0].userId2)
                fetchUsersIfNotExist(userIds)
                // fetch("http://localhost:8080/user/get", {
                //     method: "POST",
                //     headers: {
                //         authorization: `bearer ${user.token}`
                //     },
                //     body: JSON.stringify({userIds})
                // })
                // .then(res=>res.json())
                // .then(data=>{
                //     if(!data.error){
                //         const usersData = {}
                //         const uids = data.map(userDetails=>userDetails._id)
                //         for(let i = 0; i < uids.length; i++){
                //             usersData[uids[i]] = data[i]
                //         }
                //         // console.log("user data : ", usersData)
                //         // setOtherUsers(usersData)
                //         setUsers(usersData)
                //     }else{
                //         console.log(data.error)
                //     }
                // })
                // .catch(err=>console.log(err))
                break
            case "GroupList": 
                // const list = data.data
                // console.log("chat group list : ", list)
                // console.log("group list: ", data.data)
                const userIdsToFetch = []
                data.data = data.data.map(group => {
                    // console.log("group list: ", groups.members)
                    userIdsToFetch.push(...group.members)
                    group.type = "group"
                    return group
                })
                fetchUsersIfNotExist(userIdsToFetch)
                setGroups(data.data)
                break
            case "CommunityList":
                // const list = data.data
                // console.log("chat group list : ", list)
                // console.log("group list: ", data.data)
                data.data = data.data.map(community => {
                    community.type = "community"
                    return community
                })
                setCommunities(data.data)
                break
            case "chatMessages": 
                // console.log("messages : ", data)
                // console.log("unread list : ", data.data.unreadMessageList)
                // setMessageList(data.data.messageList)
                // setUnreadMessageList(data.data.unreadMessageList)

                // console.log("messages ---------- : ", data.data)
                messagesListDispatch({type: "add/update", payload: {chatId: data.data.chatId, messages: data.data}})
                console.log("messages : ", data.data)
                break
            case "chat":
                setChats(prev=>{
                    data.data.type = "chat"
                    const index = prev.findIndex(chat=>chat._id === data.data._id)
                    // console.log("prev chat index : ",index)
                    if(index >= 0){
                        prev[index] = {...prev[index], ...data.data}
                    }else{
                        prev.push(data.data)
                    }
                    return [...prev]
                })
                break
            case "group-chat":
                setGroups(prev=>{
                    console.log("group chat received : ", data)
                    data.data.type = "group"
                    // console.log("chat list : +++++++++++++++++++++++++++++++ ", prev)
                    const index = prev.findIndex(group=>group._id === data.data._id)
                    if(index >= 0){
                        prev[index] = {...prev[index], ...data.data}
                    }else{
                        prev.push(data.data)
                    }
                    return [...prev]
                })
                break
            case "community-chat":
                console.log("community chat received : ", data)
                setCommunities(prev=>{
                    // console.log("communities: ", prev)
                    data.data.type = "community"
                    // console.log("chat list : +++++++++++++++++++++++++++++++ ", prev)
                    const index = prev.findIndex(community=>community._id === data.data._id)
                    if(index >= 0){
                        prev[index] = {...prev[index], ...data.data}
                        // console.log("community chat received : ", prev[index])
                    }else{
                        prev.push(data.data)
                    }
                    return [...prev]
                })
                break
            case "open-chat":
                changeChat(data.data, "chat")
                break
            default:
              console.log('Unknown message type:', data.type, data.data);
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
      }, [user]);

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


    function changeChat(newChat, type){

        setSocket(socket=>{
            if(type == "chat"){
                const friendId = user.userId === newChat.userId1 ? newChat.userId2 : newChat.userId1
        
                // console.log("changing the chat : ", type)
                if(!messagesList[newChat._id]){
                    socket.send(JSON.stringify({
                        type: "chat",
                        data: {
                            senderUserId: friendId
                        }
                    }))
                }else{
                    socket.send(JSON.stringify({
                        type: "message-received",
                        data: {
                            senderUserId: friendId
                        }
                    }))
                }
    
                setChats(prev=>{
                    const index = prev.findIndex(chat=>chat._id === newChat._id)
                    prev[index] = {...prev[index], unreadMessageCount: 0}
                    return [...prev]
                })
                
            }else if(type == "group"){
                // TODO : fetch the group messages from the chat server
    
                // console.log("changing the chat : ", type)
                if(!messagesList[newChat._id]){
                    socket.send(JSON.stringify({
                        type: "get-group-message",
                        data: {
                            groupId: newChat._id
                        }
                    }))
                }else{
                    socket.send(JSON.stringify({
                        type: "group-message-received",
                        data: {
                            groupId: newChat._id
                        }
                    }))
                }
    
                setGroups(prev=>{
                    const index = prev.findIndex(group=>group._id === newChat._id)
                    prev[index] = {...prev[index], unreadMessageCount: 0}
                    return [...prev]
                })
            }else if(type == "community"){
                // TODO : fetch the group messages from the chat server
    
                // console.log("changing the chat : ", type)
                // if(!messagesList[newChat._id]){
                //     socket.send(JSON.stringify({
                //         type: "get-group-message",
                //         data: {
                //             groupId: newChat._id
                //         }
                //     }))
                // }else{
                //     socket.send(JSON.stringify({
                //         type: "group-message-received",
                //         data: {
                //             groupId: newChat._id
                //         }
                //     }))
                // }
    
                // setGroups(prev=>{
                //     const index = prev.findIndex(group=>group._id === newChat._id)
                //     prev[index] = {...prev[index], unreadMessageCount: 0}
                //     return [...prev]
                // })
            }
    
            setCurrentChat(prev=>{
                if(prev && prev.type !== "community" && prev.chat){
                    messagesListDispatch({type: "resetUnreadMessages", payload: {chatId: prev.chat._id}})
                }
                return {type, chat: newChat}
            })
    
            if(type !== "community"){
                scrollToTopOfUnreadMessages()
            }

            return socket
        })

    }

    // console.log("unread message list :", unreadMessageList)

    function sortMessages(m1, m2){
        const ts1 = new Date(m1.timestamp)
        const ts2 = new Date(m2.timestamp)
        if(ts1 > ts2) return 1
        else if(ts1 > ts2) return 0
        return -1
    }

    const messageList = messagesList[currentChat?.chat?._id]?.messageList.sort(sortMessages)
    const unreadMessageList = messagesList[currentChat?.chat?._id]?.unreadMessageList.sort(sortMessages)

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

    // console.log("jlkdsf : ", currentChat)
    // console.log("chats : ", chats)


    // CHAT ORGANIZATION ====================================================== 

    const [chatFilter, setChatFilter] = useState("all")
    let cgcList = [] // chat group community list

    const groupsInCommunities = []
    let groupsNotInCommunities = []
    let communitiesWithGroups = []
    let privateChats = []

    if(chatFilter == "communities" || chatFilter == "all" || chatFilter == "unread"){
        // console.log("communities: ", communities)
        communitiesWithGroups = communities.length <= 0 ? [] : communities.map(community=>{
            // console.log("groups of the community: ", community, community.groups)
            const groupsOfCommunity = community.groups?.map(groupId => {
                const index = groups.findIndex(group=>group._id == groupId)
                const group = groups[index]
                // groups.splice(index, 1)
                groupsInCommunities.push(groupId)
                return group
            }).filter(group=>{
                if(group) return true
                return false
            })
            community.groups = groupsOfCommunity
            return community
        })
    }

    if(chatFilter == "all" || chatFilter == "unread"){
        groupsNotInCommunities = groups.filter(group=>{
            const index = groupsInCommunities.findIndex(id=>id == group._id)
            if(index >= 0){
                return false
            }
            return true
        })
    }

    if(chatFilter == "groups"){
        groupsNotInCommunities = groups.filter(group=>{
            if(group.name.includes("Announcement") || group.name.includes("General")) return false
            return true
        })
    }

    if(chatFilter == "private" || chatFilter == "all" || chatFilter == "unread"){
        privateChats = chats.map(chat=>chat)
    }

    cgcList.push(...privateChats, ...groupsNotInCommunities, ...communitiesWithGroups)
    cgcList.sort((c1, c2)=>{
        const t1 = c1.lastMessageTimestamp || c1.updatedAt
        const t2 = c2.lastMessageTimestamp || c2.updatedAt
        if(t1 > t2){
            return -1
        }else if(c1.updatedAt === c2.updatedAt){
            return 0
        }else{
            return 1
        }
    })
    // console.log("cgcList : ", cgcList)

    // let filter
    // console.log("chat filter : ", chatFilter)
    // switch(chatFilter){
    //     case "all":
    //         filter = (_) => true
    //         break
    //     case "groups":
    //         filter = (chat) => {
    //             console.log("chat : ", chat)
    //             if(chat.type === "group") return true
    //             return false
    //         }
    //         break
    //     default:
    //         filter = (_) => true
    // }
    // cgcList = cgcList.filter(filter)

    // ===================================================================

    let chatTitle
    if(currentChat?.type == "chat"){
        chatTitle = otherUsers[currentChat?.chat?.userId1]?.name
    }else{
        chatTitle = currentChat?.chat?.name
    }


    // console.log(otherUsers)
    // console.log(currentChat?.chat?.members)

    const membersText = currentChat && currentChat.type === "group" && currentChat.chat.members?.map((member)=>otherUsers[member].name).toString().replace(",", ", ")
    //   setTimeout(tempFunc, 5000)

    const [show, setShow] = useState(true)
    const detailsPannelToggle = (e) => {
        setShow(prev=>!prev)
    }

    const newChatPopupHandler = (e) => {
        e.stopPropagation()
        setMenuVisible(false)
        openPopup(document.querySelector(".chat .popup-box.new-chat"))
    }
    
    const newGroupPopupHandler = (e) => {
        e.stopPropagation()
        setMenuVisible(false)
        openPopup(document.querySelector(".chat .popup-box.new-group"))
    }
    
    const newCommunityPopupHandler = (e) => {
        e.stopPropagation()
        setMenuVisible(false)
        openPopup(document.querySelector(".chat .popup-box.new-community"))
    }

    const addMembersPopupHandler = (e) => {
        e.stopPropagation()
        setMenuVisible(false)
        openPopup(document.querySelector(".chat .popup-box.add-members"))
    }

    const makeAdminHandler = (member) => {
        // if(currentChat.type === "group"){
        const type = currentChat?.type // either group or community
            socket.send(JSON.stringify({
                type: `add-${type}-admins`,
                data: {
                    [`${type}Id`]: currentChat.chat._id,
                    admins: [member._id]
                }
            }))
        // }
    }

    const removeAdminHandler = (member) => {
        // console.log("removing admin : ", member)
        // if(currentChat.type === "group"){
        const type = currentChat?.type
            socket.send(JSON.stringify({
                type: `remove-${type}-admins`,
                data: {
                    [`${type}Id`]: currentChat.chat._id,
                    admins: [member._id]
                }
            }))
        // }
    }

    const removeMemberHandler = (member) => {
        // if(currentChat.type === "group"){
        const type = currentChat?.type
            socket.send(JSON.stringify({
                type: `remove-${type}-members`,
                data: {
                    [`${type}Id`]: currentChat.chat._id,
                    members: [member._id]
                }
            }))
        // }
    }

    // CONTEXT MENU =============================================

    const contextMenuTypes = {
        menu_context: [
            { label: 'Open', id: 1, onClick: (e)=>openHandler(contextMenuDir.type, contextMenuDir.content, e)},
            { label: 'Edit', id: 2, onClick: (e)=>editHandler(contextMenuDir.type, contextMenuDir.content, e)},
            // { label: 'Sort By', id: 1, onClick: ()=>openFolder(contextMenuDir)},
            { label: 'Delete', id: 3 , color: "red", onClick: ()=>deleteHandler(contextMenuDir.type, contextMenuDir.content)},
            { label: 'Cut', id: 4, onClick: ()=>moveHandler(contextMenuDir.type, contextMenuDir.content)},
            { label: 'Copy', id: 5, onClick: ()=>copyHandler(contextMenuDir.type, contextMenuDir.content)},
            { label: 'Paste', id: 6, onClick: ()=>pasteHandler(contextMenuDir.type, contextMenuDir.content)}
        ],
        chat_context: [
            { label: 'New chat', id: 1, onClick: newChatPopupHandler},
            { label: 'New group', id: 2, onClick: newGroupPopupHandler},
            { label: 'New community', id: 3, onClick: newCommunityPopupHandler}
        ],
        filter_context: [
            { label: 'All', id: 1, onClick: ()=>setChatFilter("all")},
            { label: 'Unread', id: 2, onClick: ()=>setChatFilter("unread")},
            { label: 'Private', id: 3, onClick: ()=>setChatFilter("private")},
            { label: 'Groups', id: 3, onClick: ()=>setChatFilter("groups")},
            { label: 'Communities', id: 3, onClick: ()=>setChatFilter("communities")}
        ],
        chatbox_context: [
            { label: 'Mark as unread', id: 1, onClick: ()=>setChatFilter("all")},
            { label: 'Add to favourites', id: 3, onClick: ()=>setChatFilter("communities")},
            { label: 'Mute', id: 2, onClick: ()=>setChatFilter("unread")},
            { label: 'Pin', id: 3, onClick: ()=>setChatFilter("groups")},
            { label: 'Exit group', id: 3, onClick: ()=>setChatFilter("private"), color: "red"},
        ],
        memberbox_context: [
            { label: 'Message', id: 1, onClick: ()=>socket.send(JSON.stringify({type: "create-chat", data: {receiverUserId: currentMemberBox._id}}))},
            { label: 'View', id: 2, onClick: ()=>goto(`/user/profile/)${currentMemberBox._id}`)},
            { 
                label: currentMemberBox?.position === "Admin" ? "Dismiss as Admin" : 'Make admin',
                id: 3,
                onClick: currentMemberBox?.position === "Admin" ? ()=>removeAdminHandler(currentMemberBox) : ()=>makeAdminHandler(currentMemberBox)
            },
            { label: 'Remove', id: 4, onClick: ()=>removeMemberHandler(currentMemberBox), color: "red"},
        ]
    }

    if(currentMemberBox?.position === "Owner"){
        contextMenuTypes.memberbox_context = contextMenuTypes.memberbox_context.slice(0, 2)
    }

    if(user.userId === currentMemberBox?._id && !currentMemberBox?.position === "Owner"){
        contextMenuTypes.memberbox_context = [
            contextMenuTypes.memberbox_context[1],
            { label: 'Exit from group', id: 5, onClick: ()=>{}, color: "red"}
        ]
    }

    const contextMenuTitles = {
        menu_context: "Menu",
        chat_context: "Start a chat",
        filter_context: "Filter chats by",
        chatbox_context: "Chat menu",
        memberbox_context: "Member options"
    }

    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [menuVisible, setMenuVisible] = useState(false);

    const showMenu = (e) => {
        e.stopPropagation()
        setMenuPosition({ x: e.clientX, y: e.clientY });
        setMenuVisible("menu_context")
    }
    
    const showChatMenu = (e) => {
        e.stopPropagation()
        setMenuPosition({ x: e.clientX, y: e.clientY });
        setMenuVisible("chat_context")
    }

    const showFilterMenu = (e) => {
        e.stopPropagation()
        setMenuPosition({ x: e.clientX, y: e.clientY });
        setMenuVisible("filter_context")
    }

    const showChatboxMenu = (e) => {
        e.stopPropagation()
        e.preventDefault()
        setMenuPosition({ x: e.clientX, y: e.clientY });
        setMenuVisible("chatbox_context")
    }

    const showMemberboxMenu = (e, member) => {
        e.stopPropagation()
        e.preventDefault()
        setMenuPosition({ x: e.clientX, y: e.clientY });
        setCurrentMemberBox(member)
        setMenuVisible("memberbox_context")
    }

    // ==========================================================

    // console.log("currentChat: ", currentChat)

    let currentDate
    if(messageList?.length > 0){
        currentDate = getTimeDate(messageList[0].timestamp)
    }else if(unreadMessageList?.length > 0){
        currentDate = getTimeDate(unreadMessageList[0].timestamp)
    }
    // console.log("current date : ", currentDate)

    const prevMessageType = useRef()
    
    function renderMessages(messageList, x){

        let isPrevSame = true
        if(currentChat.type === "chat"){
            prevMessageType.current = {type : ""}
        }else{
            prevMessageType.current = {type : {}}
        }

        return (
            <div className={x === 0 ? "read-messages" : "read-messages"}>
                {
                    messageList && messageList.length > 0 && messageList.map((message) => {
                        return (
                            <MessageBox
                                key={message._id}
                                type={currentChat.type}
                                messageData={message}
                                otherUsers={otherUsers}
                                showRect={!isPrevSame}
                                prevMessageType={prevMessageType}
                            />
                        )
                    })
                }
            </div>
        );
    }

    // CHAT INPUT VISIBILITY ============================
    let userPermissionLevel
    if(currentChat && currentChat.type === "group"){
        if(user.userId === currentChat.chat.createdBy){
            userPermissionLevel = "owner-only"
        }else if(current.chat.createdBy.admins.indexOf(user.userId) >= 0){
            userPermissionLevel = "admins-only"
        }else{
            userPermissionLevel = "members-only"
        }
    }
    // ==================================================

    return ( 
        <div className="chat" onClick={()=>setMenuVisible(false)}>
            {/* <Topbar /> */}
            <PopupBox className="new-chat" key="1">
                <NewChatForm socket={socket}/>
            </PopupBox>
            <PopupBox className="new-group" key="2">
                <NewGroupForm socket={socket}/>
            </PopupBox>
            <PopupBox className="new-community" key="3">
                <NewCommunityForm socket={socket} groups={groups}/>
            </PopupBox>
            <PopupBox className="add-members" key="4">
                <AddMembersForm socket={socket} currentChat={currentChat}/>
            </PopupBox>
            <div className="bottom">
                <div className="left-pannel-cont">
                    <ContextMenuContainer 
                        contextMenuTypes={contextMenuTypes}
                        contextMenuTitles={contextMenuTitles}
                        position={menuPosition}
                        visible={menuVisible}
                    />
                    <div className="top">
                        <div className="row">
                            <div className="title">Chats</div>
                            <div className="right">
                                <button className="collapse-icon-button" onClick={showChatMenu} ><img src={editIcon} /></button>
                                <button className="collapse-icon-button" onClick={showFilterMenu} ><img src={filterIcon} /></button>
                            </div>
                        </div>
                        <div className="row">
                            <form className="search">
                                <input type="text" value="" placeholder="Search a chat" />
                            </form>
                        </div>
                    </div>
                    <div className="left-pannel-scroll">
                        <div className="left-pannel">
                            {
                                cgcList && cgcList.length > 0 && cgcList.map((v, i)=>{
                                    return (
                                        <ChatBox 
                                            key={v._id}
                                            currentChat={currentChat}
                                            chatDetails={v}
                                            setCurrent={changeChat}
                                            otherUsers={otherUsers}
                                            onContext={showChatboxMenu}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="right-cont">
                    { !currentChat ? (
                        <div className="right no-chat-selected">
                            <img src={chatSelectImg} />
                            <div className="right-text">
                                Select a Group or a Private chat to view its messages
                            </div>
                        </div>
                    ):
                    (
                        <div className="right">
                            <div className="user-group-details">
                                <div className="left">
                                    <div className="user-group-img">
                                        <img src={groupImg} alt="" />
                                    </div>
                                    <div className="text">
                                        <div className="user-group-name">{chatTitle}</div>
                                        {/* <div className="group-members-list">member1, member2, ...</div> */}
                                        {membersText && (<div className="group-members-list">{membersText}</div>)}
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="menu" onClick={showMenu}>
                                        <img src={menuIcon} />
                                    </div>
                                    {!show ? (<button className="icon-button" onClick={detailsPannelToggle}>&lt;show</button>) :
                                    (<button className="icon-button" onClick={detailsPannelToggle}>close&gt;</button>)}
                                </div>
                            </div>
                            <div className="messages-cont">
                                {currentChat.type === "community" ? (
                                    <div className="messages community-selected">
                                        <img src={chatSelectImg} />
                                        <div className="community-selected-text">
                                            Select a group in the community to view its messages
                                        </div>
                                    </div>
                                ): (
                                    <div className="messages">
                                        {()=>renderMessages(messageList)}
                                        {unreadMessageList && unreadMessageList.length > 0 && 
                                            (
                                                <div className="messages-seperator">
                                                    Unread messages
                                                </div>
                                            )
                                        }
                                        {()=>renderMessages(unreadMessageList)}
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
                                    </div>
                                )}
                                {currentChat && 
                                (
                                    currentChat.type === "chat" ||
                                    (currentChat.type === "group" && !currentChat.chat.requestToJoin && isAuthorized(userPermissionLevel, currentChat.chat.permissions.sendMessages))
                                ) &&
                                 (<ChatInputBox currentChat={currentChat} socket={socket}/>)}
                            </div>
                        </div>
                    )}
                </div>
                {show && 
                    (<div className="details-pannel-container">
                        <ChatDetails currentChat={currentChat} otherUsers={otherUsers} socket={socket} showMemberboxMenu={showMemberboxMenu} onAddMembersClick={addMembersPopupHandler}/>
                    </div>
                )}
            </div>
        </div>
     );
}
 
export default Chat;