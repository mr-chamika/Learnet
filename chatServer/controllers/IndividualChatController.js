const Message = require("../models/IndChat/Message")
const Chat = require("../models/IndChat/Chat");

async function createPrivateChatController(data, ws, svr){
    const { receiverUserId } = data;

    if(ws.isAuthenticated){
        let chat = await Chat.findChat(receiverUserId, ws.decodedUser.userId)
        if(chat){
            console.log("chat found : ", chat)
            ws.send(JSON.stringify({
                type: "open-chat",
                data: chat
            }))
        }else{
            const newMessage = Message.createMessage(
                ws.decodedUser.userId,
                receiverUserId,
                "update",
                `<userId>${ws.decodedUser.userId} started the chat`
            )

            const chat = await Chat.createChat(
                receiverUserId,
                ws.decodedUser.userId,
                ws.decodedUser.userId,
                `<userId>${ws.decodedUser.userId} started the chat`,
                "update"
            )

            if (svr.isUserOnline(receiverUserId)) {
                const receiverws = svr.getSocketOfUser(receiverUserId)
                receiverws.send(
                    JSON.stringify({
                        type: 'message',
                        data: {
                            chatType: "chat",
                            message: newMessage,
                            chatId: chat._id
                        }
                    })
                )

                receiverws.send(JSON.stringify({
                    type: "chat",
                    data: chat
                }))
            }

            ws.send(JSON.stringify({
                type: 'message',
                data: {
                    message: newMessage,
                    chatId: chat._id
                }
            }))

            ws.send(JSON.stringify({
                type: "chat",
                data: chat
            }))

            await newMessage.save()
            await chat.save()
        }
    }
}

async function messageSendRequestController(data, ws, svr){
    if(ws.isAuthenticated){
        // If user is already authenticated, treat the data as a message
        try {
            const { receiverUserId, message } = data;
            console.log("ws.decodedUser.userId : ", ws.decodedUser.userId)
            console.log("receiverUserId : ", receiverUserId)
            console.log("message : ", message)
    
            // Save message to database
            // const newMessage = new Message({
            //   userId1: new mongoose.Types.ObjectId(String(ws.decodedUser.userId)), // From JWT (already verified)
            //   userId2: new mongoose.Types.ObjectId(String(receiverUserId)),
            //   message: message,
            //   type: "text",
            //   isRead: false,
            // })
            const newMessage = Message.createMessage(ws.decodedUser.userId, receiverUserId, "text", message)
    
            // Check if recipient is online and deliver the message if they are
            // if (svr.isUserOnline(receiverUserId)) {
            //     svr.getSocketOfUser(receiverUserId).send(
            //         JSON.stringify({
            //             type: 'message',
                        // data: {
                        //     sender: ws.decodedUser.email,
                        //     message,
                        //     timestamp: newMessage.timestamp,
                        // }
                //         data: {
                //             message: newMessage,
                //             chatId: chat.
                //         }
                //     })
                // )
                
                // newMessage.isRead = true
                // ws.send(JSON.stringify({ 
                //     type: 'message-received',
                //     data: {
                //         receiverId: new mongoose.Types.ObjectId(String(receiverUserId)),
                //         isReceiverOnline: true
                //     }
                // }));
            // } else {
                // Recipient is offline, the message will be delivered when they come online
                ws.send(JSON.stringify({ type: 'info', message: 'Recipient is offline. Message stored.' }));
                // ws.send(JSON.stringify({ 
                //     type: 'message-received',
                //     data: {
                //         receiverId: new mongoose.Types.ObjectId(String(receiverUserId)),
                //         isReceiverOnline: false
                //     }
                // }));
            // }

            if(!newMessage.isRead){
                let chat = await Chat.findChat(receiverUserId, ws.decodedUser.userId)
                
                if(!chat){
                    // chat = new Chat({
                    //     userId1: new mongoose.Types.ObjectId(String(receiverUserId)),
                    //     userId2: new mongoose.Types.ObjectId(String(ws.decodedUser.userId)),
                    //     lastMessage: message,
                    //     unreadMessageCount: 1
                    // })

                    chat = await Chat.createChat(receiverUserId, ws.decodedUser.userId, ws.decodedUser.userId, message)
                    console.log("Chat does not found. new chat created : ", chat)
                }else{
                    console.log("Chat found : ", chat)
                    if(chat.isSender(ws.decodedUser.userId)){
                        console.log("is the last message sender")
                        // chat.lastMessage = message
                        // chat.unreadMessageCount += 1
                        await chat.increaseUnreadCount(newMessage)
                    }else{
                        console.log("is not last message sender")
                        // chat.lastMessage = message
                        // chat.unreadMessageCount = 0
                        // chat.senderId = ws.decodedUser.userId
                        await chat.resetLastMessage(newMessage, ws.decodedUser.userId)
                    }
                }

                if (svr.isUserOnline(receiverUserId)) {
                    const receiverws = svr.getSocketOfUser(receiverUserId)
                    receiverws.send(
                        JSON.stringify({
                            type: 'message',
                            data: {
                                chatType: "chat",
                                message: newMessage,
                                chatId: chat._id
                            }
                        })
                    )

                    receiverws.send(JSON.stringify({
                        type: "chat",
                        data: chat
                    }))
                }
                ws.send(JSON.stringify({
                    type: 'message',
                    data: {
                        message: newMessage,
                        chatId: chat._id
                    }
                }))

                ws.send(JSON.stringify({
                    type: "chat",
                    data: chat
                }))

                await chat.save()
            }

            await newMessage.save();

        } catch (err) {
            console.log('Error processing message data:', err);
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
    }else{
        console.log("Unauthenticated user is trying to send a message")
    }
}

async function messagesGetRequestController(data, ws, svr){
    if(ws.isAuthenticated){
        try{
            const { senderUserId } = data;

            // const userId1 = new mongoose.Types.ObjectId(String(senderUserId))
            // const userId2 = new mongoose.Types.ObjectId(String(ws.decodedUser.userId))

            // let chat = await Chat.findOne({
            //     receiver: new mongoose.Types.ObjectId(String(ws.decodedUser.userId)),
            //     sender: new mongoose.Types.ObjectId(String(senderUserId))
            // })
            let chat = await Chat.findChat(ws.decodedUser.userId, senderUserId)

            // const messageList = await Message
            // .find({$or: [{userId1, userId2, isRead: true}, {userId2, userId1, isRead: true}]}, {_id: 0, __v: 0})
            // .limit(messageBatchSize + chat.unreadMessageCount)
            // .hint({userId1: 1, userId2: 1})

            // const unreadMessageList = await Message
            // .updateMany({$or: [{userId1, userId2, isRead: false}, {userId2, userId1, isRead: false}]}, ,{_id: 0, __v: 0})
            // .hint({userId1: 1, userId2: 1})
            // .limit(100)

            if(chat){
                const msgs = await Message.getMessages(ws.decodedUser.userId, senderUserId)
                // console.log("msgs : ", msgs)
    
                // ws.send(JSON.stringify({type: "chat", data: messageList.concat(unreadMessageList)}))
                // ws.send(JSON.stringify({type: "chat", data: messageList}))
    
                if(chat.isSender(ws.decodedUser.userId)){
                    console.log("isSender : ", true)
                    ws.send(JSON.stringify({type: "chatMessages", data: {
                        chatId: chat._id,
                        messageList: msgs[0],
                        unreadMessageList: msgs[1]
                    }}))
                }else{
                    chat.unreadMessageCount = 0
                    await chat.save()
                    await Message.markMessagesAsRead(msgs[1])
                    ws.send(JSON.stringify({
                        type: "chat",
                        data: chat
                    }))
                    ws.send(JSON.stringify({type: "chatMessages", data: {
                        chatId: chat._id,
                        messageList: msgs[0],
                        unreadMessageList: msgs[1]
                    }}))
                }
            }else{
                console.log("No chat found")
            }



        } catch (err) {
            console.log('Error processing message data:', err);
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
    }
}

async function messageCountResetController(data, ws, svr){
    const { senderUserId } = data;
    const userId = ws.decodedUser.userId

    let chatObj = await Chat.findChat(userId, senderUserId)

    if(chatObj){

        await chatObj.resetUnreadMessageCount()

        const chat = {
            _id: chatObj._id,
            unreadMessageCount: 0,
        }
    
        ws.send(JSON.stringify({
            type: "chat",
            data: chat
        }))
    }else{
        ws.send({"info": "chat cannot be found."})
    }

}

module.exports = {createPrivateChatController, messageSendRequestController, messagesGetRequestController, messageCountResetController}