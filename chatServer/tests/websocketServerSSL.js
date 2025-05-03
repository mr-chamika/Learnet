const WebSocket = require('ws');
const https = require("https");
const http = require("http");
const fs = require("fs")
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const secretKey = 'JKLDSJFLIR932749&*%&%&^&^%';

// MongoDB connection (ensure you have MongoDB running)
mongoose.connect('mongodb://localhost:27017/chatapp');

// Define the message schema and model
const messageSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }, // To mark if recipient has read the message
});

const msgSchema = new mongoose.Schema({
    userId1: {
        type: mongoose.SchemaTypes.ObjectId,
        require: true
    },
    userId2: {
        type: mongoose.SchemaTypes.ObjectId,
        require: true
    },
    type: {
        type: String,
        enum: ["text", "video", "image", "note", "link","event"],
        default: "text"
    },
    message: {
        type: String,
        require: true
    },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }, // To mark if recipient has read the message
  });

const chatSchema = new mongoose.Schema({
    receiver: { //main - user
        type: mongoose.SchemaTypes.ObjectId,
        require: true
    },
    sender: {
        type: mongoose.SchemaTypes.ObjectId,
        require: true
    },
    lastMessage: {
        type: String,
        require: true
    },
    unreadMessageCount: {
        type: Number,
        require: true
    },
    lastMessageTimestamp: { type: Date, default: Date.now }
})


const activeContactListSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    activeContactList: {
        type: Array,
        require: true
  }
})

// ------------------------ DB -------------------------------------
const Message = mongoose.model('Message', msgSchema);
const Chat = mongoose.model("Chat", chatSchema);
// const ActiveContactList = mongoose.model("ActiveContactList", activeContactListSchema)
// -----------------------------------------------------------------

class SocketMessage{
    #dataStructure

    constructor(type, data, dataStructure){
        this.type = type
        this.data = data
        this.#dataStructure = dataStructure
    }

    this(messageObj){
        this.type = messageObj.type
        this.data = messageObj.data
    }

    verify(){

    }
}

async function replyToMessage(messageReceived, ws){

    switch(messageReceived.type){
        case "token":
            const token = messageReceived.data.toString();

            jwt.verify(token, secretKey, async (err, decoded) => {
                if (err) {
                    ws.send(JSON.stringify({ type: 'error', data: 'Authentication failed' }));
                    ws.close();
                    console.log('JWT Verification Error:', err);
                } else {
                    // Store the user email and ws in onlineUsers map
                    decodedUser = decoded; // Save decoded user for future messages
                    onlineUsers[decoded.userId] = ws;
                    isAuthenticated = true; // Set authentication flag
                    console.log(`${decoded.email} is now online`);

                    // Send a confirmation message to the client that the user is authenticated
                    ws.send(JSON.stringify({ type: 'success', data: 'Authentication successful' }));

                    // Deliver any unread messages
                    const unreadMessages = await Message.find({ userId2: decoded.userId, isRead: false });
                    const chatList = await Chat.find({ receiver: decoded.userId }).projection({ receiver: 0 })

                    // unreadMessages.forEach((message) => {
                    //     ws.send(
                    //     //   JSON.stringify({
                    //     //     type: 'message',
                    //     //     sender: message.sender,
                    //     //     content: message.content,
                    //     //     timestamp: message.timestamp,
                    //     //   })
                    //     JSON.stringify(message)
                    //     );
                    //     message.isRead = true; // Mark as read
                    //     message.save();
                    // });

                    ws.send(JSON.stringify({
                        type: "ChatList",
                        data: chatList
                    }))
                }
            });
        
        case "Message":
            try {
                const { receiverUserId, message } = messageReceived;
        
                // Save message to database
                const newMessage = new Message({
                    userId1: new mongoose.Types.ObjectId(String(decodedUser.userId)), // From JWT (already verified)
                    userId2: new mongoose.Types.ObjectId(String(receiverUserId)),
                    message: message,
                    type: "text",
                    isRead: false,
                });
        
                let chat = await Chat.findOne({
                    receiver: new mongoose.Types.ObjectId(String(receiverUserId)),
                    sender: new mongoose.Types.ObjectId(String(decodedUser.userId))
                })
        
                if(!chat){
                    chat = new Chat({
                        receiver: new mongoose.Types.ObjectId(String(receiverUserId)),
                        sender: new mongoose.Types.ObjectId(String(decodedUser.userId)),
                        lastMessage: message,
                        unreadMessageCount: 1
                    })
                    console.log("Chat does not found. new chat created : ", chat)
                }else{
                    chat.lastMessage = message
                    chat.unreadMessageCount += 1
                    console.log("Chat found : ", chat)
                }
        
                
                await newMessage.save();
                await chat.save()
        
                // Check if recipient is online and deliver the message if they are
                if (onlineUsers[receiverUserId]) {
                    onlineUsers[receiverUserId].send(
                        JSON.stringify({
                        type: 'message',
                        sender: decodedUser.email,
                        message,
                        timestamp: newMessage.timestamp,
                        })
                    );
                } else {
                    // Recipient is offline, the message will be delivered when they come online
                    ws.send(JSON.stringify({ type: 'info', message: 'Recipient is offline. Message stored.' }));
                }
                } catch (err) {
                    console.log('Error processing message data:', err);
                    ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
                }
    }
}





class WebSocketServer{
    #handlers
    // Map to track online users by email
    #onlineUsers = {}; // { email: ws }

    constructor(isSecure, certPath = null, keyPath = null){
        this.#handlers = {}
        
        let server
        if(isSecure && certPath && keyPath){
            server = https.createServer({
                cert: fs.readFileSync('./cert/server.crt'),
                key: fs.readFileSync('./cert/server.key'),
            });
        }else{
            server = http.createServer()
        }
        this.server = server

        this.wss = new WebSocket.Server({ 
            server,
            verifyClient: (info, cb) => {
                const origin = info.origin;
                // console.log("origin : ", info)
                // Validate origin here
                cb(true);
            }
        })   
    }

    listen(){
        this.wss.on('connection', (ws) => {

            ws.isAuthenticated = false
            ws.decodedUser = null

            ws.on('message', async (data) => {
                const parsedData = JSON.parse(data)
                const handler = this.#handlers[parsedData.type]
                await handler(parsedData.data, ws, this)
            })
            
            // Handle when the user disconnects
            ws.on('close', () => {
                if (isAuthenticated && decodedUser) {
                const userEmail = decodedUser.email;
                delete onlineUsers[userEmail];
                console.log(`${userEmail} has gone offline`);
                }
            })
    
            ws.on('error', (err) => {
                console.log('Connection error:', err.message);
            })
        })

        // Start the HTTPS server and WebSocket server
        this.server.listen(5000, () => {
            console.log('Secure WebSocket chat server running on port 5000');
        });

    }

    isUserOnline(userId){
        if(this.#onlineUsers[userId]){
            return true
        }
        return false
    }

    setUserOnline(userId){
        this.#onlineUsers[userId] = true
    }

    addHandler(type, handler){
        if(handler.length === 3){
            this.#handlers[type] = handler
        }else{
            throw Error("Handler should be a function that accepts three parameters")
            // function func(message, socket, server), onlineUsers,
        }
    }


}

// class socket - isAuthenticated, send, close
// class websocketServer - addHandler, start(listen), 





// Map to track online users by email
const onlineUsers = {}; // { email: ws }

const server = https.createServer({
  //   cert: fs.readFileSync('path/to/cert.pem'),
  //   key: fs.readFileSync('path/to/key.pem'),
    cert: fs.readFileSync('./cert/server.crt'),
    key: fs.readFileSync('./cert/server.key'),
});

// const server = http.createServer()

const wss = new WebSocket.Server({ 
    server,
    verifyClient: (info, cb) => {
        const origin = info.origin;
        // console.log("origin : ", info)
        // Validate origin here
        cb(true);
    }
});

wss.on('connection', (ws) => {
  let isAuthenticated = false; // Flag to check if user is authenticated
  let decodedUser; // Store decoded JWT payload

  console.log('New client connected');

  // When a message is received from the client
  ws.on('message', async (data) => {

      console.log("kkkkkkkkkkkkkkkkkkkkkkkkkk")
      console.log("gggggggggggggggggggggggggggg")

    // if(!isAuthenticated){
    //     replyToMessage({type: "token", data}, ws)
    // }else{
    //     const messageReceived = JSON.parse(data);
    //     replyToMessage(messageReceived, ws)
    // }

    if (!isAuthenticated) {
      // First message should be the JWT token
      const token = data.toString();

      jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          ws.send(JSON.stringify({ type: 'error', message: 'Authentication failed' }));
          ws.close();
          console.log('JWT Verification Error:', err);
        } else {
          // Store the user email and ws in onlineUsers map
          decodedUser = decoded; // Save decoded user for future messages
          onlineUsers[decoded.userId] = ws;
          isAuthenticated = true; // Set authentication flag
          console.log(`${decoded.email} is now online`);

          // Send a confirmation message to the client that the user is authenticated
          ws.send(JSON.stringify({ type: 'success', message: 'Authentication successful' }));

          // Deliver any unread messages
          const unreadMessages = await Message.find({ userId2: decoded.userId, isRead: false });
          const chatList = await Chat.find({ receiver: decoded.userId }).projection({ receiver: 0 })

          unreadMessages.forEach((message) => {
            ws.send(
            //   JSON.stringify({
            //     type: 'message',
            //     sender: message.sender,
            //     content: message.content,
            //     timestamp: message.timestamp,
            //   })
              JSON.stringify(message)
            );
            message.isRead = true; // Mark as read
            message.save();
          });

          ws.send(JSON.stringify({
            type: "ChatList",
            data: chatList
          }))
        }
      });
    } else {
      // If user is already authenticated, treat the data as a message
      try {
        const parsedData = JSON.parse(data);
        const { receiverUserId, message } = parsedData;

        // Save message to database
        const newMessage = new Message({
          userId1: new mongoose.Types.ObjectId(String(decodedUser.userId)), // From JWT (already verified)
          userId2: new mongoose.Types.ObjectId(String(receiverUserId)),
          message: message,
          type: "text",
          isRead: false,
        });

        let chat = await Chat.findOne({
            receiver: new mongoose.Types.ObjectId(String(receiverUserId)),
            sender: new mongoose.Types.ObjectId(String(decodedUser.userId))
        })

        
        if(!chat){
            chat = new Chat({
                receiver: new mongoose.Types.ObjectId(String(receiverUserId)),
                sender: new mongoose.Types.ObjectId(String(decodedUser.userId)),
                lastMessage: message,
                unreadMessageCount: 1
            })
            console.log("Chat does not found. new chat created : ", chat)
        }else{
            chat.lastMessage = message
            chat.unreadMessageCount += 1
            console.log("Chat found : ", chat)
        }

        
        await newMessage.save();
        await chat.save()

        // Check if recipient is online and deliver the message if they are
        if (onlineUsers[receiverUserId]) {
          onlineUsers[receiverUserId].send(
            JSON.stringify({
              type: 'message',
              sender: decodedUser.email,
              message,
              timestamp: newMessage.timestamp,
            })
          );
        } else {
          // Recipient is offline, the message will be delivered when they come online
          ws.send(JSON.stringify({ type: 'info', message: 'Recipient is offline. Message stored.' }));
        }
      } catch (err) {
        console.log('Error processing message data:', err);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    }
  });

  // Handle when the user disconnects
  ws.on('close', () => {
    if (isAuthenticated && decodedUser) {
      const userEmail = decodedUser.email;
      delete onlineUsers[userEmail];
      console.log(`${userEmail} has gone offline`);
    }
  });

  ws.on('error', (err) => {
    console.log('Connection error:', err.message);
  });
});

// Start the HTTPS server and WebSocket server
server.listen(5000, () => {
  console.log('Secure WebSocket chat server running on port 5000');
});
// console.log('WebSocket chat server running on port 5000');


// ------------------ Message types -------------------------
const x = {
    type: "Chats",
    data: [
        {
            sender: {
                type: mongoose.SchemaTypes.ObjectId,
                require: true
            },
            lastMessage: {
                type: String,
                require: true
            },
            unreadMessageCount: {
                type: Number,
                require: true
            },
            lastMessageTimestamp: { type: Date, default: Date.now }
        }
    ]
}

const xx = {
    types: "Message",
    data: {
        sender: "",
        message: "",
        type: "",
        isRead: true
    }
}

const xxx = {
    type: "Messages",
    data: [
        {
            sender: "",
            message: "",
            type: "",
            isRead: true
        }
    ]
}