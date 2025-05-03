const net = require('net');
const jwt = require('jsonwebtoken');
const secretKey = 'JKLDSJFLIR932749&*%&%&^&^%';








// When user logs in, generate a token
// app.post('/login', (req, res) => {
//     const { email, password } = req.body;

//     // Assuming user authentication happens here
//     const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
//     res.json({ token });
// });






const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: String,
    recipient: String,
    content: String,
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },  // To mark if recipient has read the message
});

const Message = mongoose.model('Message', messageSchema);









const onlineUsers = {}; // Map to track online users by email

const chatServer = net.createServer(socket => {
    let isAuthenticated = false;  // Flag to check if user is authenticated
    let decodedUser;              // Store decoded JWT payload

    // When a user establishes a connection and sends the JWT
    socket.on('data', (data) => {
        if (!isAuthenticated) {
            // First time data event (assume it's the token)
            const token = data.toString();

            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    socket.write('Authentication failed');
                    socket.destroy();
                    console.log('JWT Verification Error:', err);
                } else {
                    // Store the user email and socket in onlineUsers map
                    decodedUser = decoded;  // Save decoded user for future messages
                    onlineUsers[decoded.email] = socket;
                    isAuthenticated = true;  // Set authentication flag
                    console.log(`${decoded.email} is now online`);

                    // You can send a confirmation message to the client that the user is authenticated
                    socket.write('Authentication successful');
                }
            });
        } else {
            // If user is already authenticated, treat the data as a message
            try {
                const { recipientEmail, content } = JSON.parse(data.toString());

                // Save message to database
                // const newMessage = new Message({
                //     sender: decodedUser.email,  // From JWT (already verified)
                //     recipient: recipientEmail,
                //     content,
                //     isRead: false
                // });

                // newMessage.save();

                // Check if recipient is online and deliver the message if they are
                if (onlineUsers[recipientEmail]) {
                    onlineUsers[recipientEmail].write(`New message from ${decodedUser.email}: ${content}`);
                } else {
                    // Recipient is offline, the message will be delivered when they come online
                    socket.write('Message stored and will be delivered when the recipient is online.');
                }
            } catch (err) {
                console.log('Error processing message data:', err);
            }
        }
    });

    // Handle when the user disconnects (either cleanly or unexpectedly)
    const removeUserFromOnlineList = () => {
        const userEmail = Object.keys(onlineUsers).find(email => onlineUsers[email] === socket);
        if (userEmail) {
            delete onlineUsers[userEmail];
            console.log(`${userEmail} has gone offline`);
        }
    };

    // When the connection ends cleanly
    socket.on('end', () => {
        console.log('Connection ended cleanly');
        removeUserFromOnlineList();
    });

    // When the connection is closed (could be after 'end' or due to an error)
    socket.on('close', () => {
        console.log('Connection closed');
        removeUserFromOnlineList();
    });

    // Handle connection errors (e.g., unexpected network issues)
    socket.on('error', (err) => {
        console.log('Connection error:', err.message);
        removeUserFromOnlineList();
    });


    socket.on('message', async (messageData) => {
        const { recipientEmail, content } = JSON.parse(messageData);
    
        // Save message to database
        const newMessage = new Message({
            sender: decoded.email,  // From JWT
            recipient: recipientEmail,
            content,
            isRead: false
        });
    
        await newMessage.save();
    
        // Check if recipient is online and deliver the message if they are
        if (onlineUsers[recipientEmail]) {
            onlineUsers[recipientEmail].write(`New message from ${decoded.email}: ${content}`);
        } else {
            // Recipient is offline, the message will be delivered when they come online
            socket.write('Message stored and will be delivered when the recipient is online.');
        }
    });

    // socket.on('connect', async () => {
    //     const unreadMessages = await Message.find({ recipient: decoded.email, isRead: false });
    
    //     unreadMessages.forEach((message) => {
    //         socket.write(`Message from ${message.sender}: ${message.content}`);
    //         message.isRead = true;  // Mark as read
    //         message.save();
    //     });
    // });
    
});

chatServer.listen(5000, () => {
    console.log('Chat server running on port 5000');
});
