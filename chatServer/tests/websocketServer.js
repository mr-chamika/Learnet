const WebSocket = require('ws');
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

const Message = mongoose.model('Message', messageSchema);

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

const ActiveContactList = mongoose.model("ActiveContactList", activeContactListSchema)

// Map to track online users by email
const onlineUsers = {}; // { email: ws }

const wss = new WebSocket.Server({ port: 5000 });

wss.on('connection', (ws) => {
  let isAuthenticated = false; // Flag to check if user is authenticated
  let decodedUser; // Store decoded JWT payload

  console.log('New client connected');

  // When a message is received from the client
  ws.on('message', async (data) => {
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
          onlineUsers[decoded.email] = ws;
          isAuthenticated = true; // Set authentication flag
          console.log(`${decoded.email} is now online`);

          // Send a confirmation message to the client that the user is authenticated
          ws.send(JSON.stringify({ type: 'success', message: 'Authentication successful' }));

          // Deliver any unread messages
          const unreadMessages = await Message.find({ recipient: decoded.email, isRead: false });

          unreadMessages.forEach((message) => {
            ws.send(
              JSON.stringify({
                type: 'message',
                sender: message.sender,
                content: message.content,
                timestamp: message.timestamp,
              })
            );
            message.isRead = true; // Mark as read
            message.save();
          });
        }
      });
    } else {
      // If user is already authenticated, treat the data as a message
      try {
        const parsedData = JSON.parse(data);
        const { recipientEmail, content } = parsedData;

        // Save message to database
        const newMessage = new Message({
          sender: decodedUser.email, // From JWT (already verified)
          recipient: recipientEmail,
          content,
          isRead: false,
        });

        await newMessage.save();

        // Check if recipient is online and deliver the message if they are
        if (onlineUsers[recipientEmail]) {
          onlineUsers[recipientEmail].send(
            JSON.stringify({
              type: 'message',
              sender: decodedUser.email,
              content,
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

console.log('WebSocket chat server running on port 5000');
