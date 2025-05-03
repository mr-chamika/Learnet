const WebSocket = require('ws');
const https = require("https")
const fs = require('fs');

const options = {
    rejectUnauthorized: false, // Set to false for self-signed certificates (not recommended for production)
    // cert: fs.readFileSync('./cert/client-cert.pem'), // Client certificate, if needed
    // key: fs.readFileSync('./cert/client-key.pem'), // Client private key, if needed
    ca: fs.readFileSync('./cert/server.crt') // Server certificate to establish trust
};

// Example JWT token creation (this would typically come from a login or another process)
const jwt = require('jsonwebtoken');
const secretKey = 'JKLDSJFLIR932749&*%&%&^&^%';
// 6734939257a4d04f9069ab33
// 111111111111111111111166
const token = jwt.sign({ userId: "111111111111111111111166", email: 'user12@example.com' }, secretKey, { expiresIn: '1h' });

// Create a secure WebSocket connection using wss://
const ws = new WebSocket('wss://localhost:5000',{
    agent: new https.Agent(options)
});

// When the WebSocket connection opens
ws.on('open', () => {
    console.log('Connected to secure WebSocket server');

    // Send the JWT token to authenticate
    ws.send(JSON.stringify({type: "token", data: token}));
});

// Handle incoming messages from the server
ws.on('message', (data) => {
    const parsedData = JSON.parse(data)
    console.log("\n\n\n\n---------Received from server: -------------\n\n")
    // console.log(parsedData.data && parsedData.data.length);
    console.log(parsedData)
    if(parsedData.type == "chat"){
        console.log(parsedData.data.unreadMessageList)
    }
});

// Handle WebSocket errors
ws.on('error', (err) => {
    console.error('WebSocket error:', err);
});

// Handle connection close
ws.on('close', () => {
    console.log('Connection to WebSocket server closed');
});

// Function to send a message
// function sendMessage(recipientEmail, content) {
//     if (ws.readyState === WebSocket.OPEN) {
//         const message = JSON.stringify({
//             type: "message",
//             data: {
//                 receiverUserId: "111111111111111111111165",
//                 message: "message from new2"
//             }
//     });
//         ws.send(message);
//     } else {
//         console.log('WebSocket is not open');
//     }
// }

// Example usage: Sending a message to a recipient
// setTimeout(() => {
//     sendMessage('gmggg@gmail.com', 'Hello, this is a secure test message from the Node.js client.');
// }, 1000);  // Delay to ensure the connection is established before sending a message

// setTimeout(() => {
//     if (ws.readyState === WebSocket.OPEN) {
//         const message = JSON.stringify({
//             type: "chat",
//             data: {
//                 senderUserId: "111111111111111111111165",
//             }
//     });
//         ws.send(message);
//     } else {
//         console.log('WebSocket is not open');
//     }
// }, 5000);


//--------- create new group ---------
// setTimeout(() => {
//     if (ws.readyState === WebSocket.OPEN) {
//         const message = JSON.stringify({
//             type: "create-group",
//             data: {
//                 name: "Test group 1",
//                 description: "just a group",
//                 members: [],
//                 admins: [],
//                 privacy: "private",
//                 permissions: {
//                     addMembers: 'admins-only',
//                     removeMembers: 'admins-only',
//                     editGroupInfo: 'admins-only',
//                     sendMessages: 'admins-only'
//                 },
//                 groupImage: ""
//             }
//     });
//         ws.send(message);
//     } else {
//         console.log('WebSocket is not open');
//     }
// }, 1000);

// ----------- Add group members -----------------
// setTimeout(() => {
//     if (ws.readyState === WebSocket.OPEN) {
//         const message = JSON.stringify({
//             type: "add-group-members",
//             data: {
//                 groupId: "6734939257a4d04f9069ab82",
//                 members: ["6734939257a4d04f9069ab21", "6734939257a4d04f9069ab12", "6734939257a4d04f9069ab33"]
//             }
//     });
//         ws.send(message);
//     } else {
//         console.log('WebSocket is not open');
//     }
// }, 3000);

// ----------- Remove group members -----------------
// setTimeout(() => {
//     if (ws.readyState === WebSocket.OPEN) {
//         const message = JSON.stringify({
//             type: "remove-group-members",
//             data: {
//                 groupId: "6734939257a4d04f9069ab82",
//                 members: ["1134939257a4d04f9069ab12"]
//             }
//     });
//         ws.send(message);
//     } else {
//         console.log('WebSocket is not open');
//     }
// }, 3000);

// ----------- Add group Admins -----------------
// setTimeout(() => {
//     if (ws.readyState === WebSocket.OPEN) {
//         const message = JSON.stringify({
//             type: "add-group-admins",
//             data: {
//                 groupId: "6734939257a4d04f9069ab82",
//                 admins: ["1134939257a4d04f9069ab12", "1134939257a4d04f9069ab33"]
//             }
//     });
//         ws.send(message);
//     } else {
//         console.log('WebSocket is not open');
//     }
// }, 3000);


// ----------- Remove group Admins -----------------
// setTimeout(() => {
//     if (ws.readyState === WebSocket.OPEN) {
//         const message = JSON.stringify({
//             type: "remove-group-admins",
//             data: {
//                 groupId: "6734939257a4d04f9069ab82",
//                 admins: ["6734939257a4d04f9069ab12"]
//             }
//     });
//         ws.send(message);
//     } else {
//         console.log('WebSocket is not open');
//     }
// }, 3000);


// ----------- Change group name -----------------
// setTimeout(() => {
//     if (ws.readyState === WebSocket.OPEN) {
//         const message = JSON.stringify({
//             type: "change-group-name",
//             data: {
//                    groupId: "6734939257a4d04f9069ab82",
//                 newName: "GG"
//             }
//     });
//         ws.send(message);
//     } else {
//         console.log('WebSocket is not open');
//     }
// }, 3000);

// ----------- Change group name -----------------
// setTimeout(() => {
//     if (ws.readyState === WebSocket.OPEN) {
//         const message = JSON.stringify({
//             type: "change-group-description",
//             data: {
//                    groupId: "6734939257a4d04f9069ab82",
//                 newName: "lorem ipsem lorem lorem ipsem lorem lorem ipsem lorem"
//             }
//     });
//         ws.send(message);
//     } else {
//         console.log('WebSocket is not open');
//     }
// }, 3000);


// ----------- send group message -----------------
// setTimeout(() => {
//     if (ws.readyState === WebSocket.OPEN) {
//         const message = JSON.stringify({
//             type: "send-group-message",
//             data: {
//                 groupId: "6734939257a4d04f9069ab82",
//                 message: "lorem ipsem new new",
//                 type: "text"
//             }
//     });
//         ws.send(message);
//     } else {
//         console.log('WebSocket is not open');
//     }
// }, 3000);

// ----------- get group message -----------------
setTimeout(() => {
    if (ws.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({
            type: "get-group-message",
            data: {
                groupId: "6734939257a4d04f9069ab82",
            }
    });
        ws.send(message);
    } else {
        console.log('WebSocket is not open');
    }
}, 3000);