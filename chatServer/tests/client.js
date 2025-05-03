// const socket = new WebSocket('ws://localhost:5000');

// socket.onmessage = (event) => {
//     const message = event.data;
//     // Update the chat UI with the new message
//     console.log('New message:', message);
// };

const net = require('net');
const jwt = require('jsonwebtoken');
const readline = require("readline-sync")
const secretKey = 'JKLDSJFLIR932749&*%&%&^&^%';

// The JWT token for authentication (normally you'd get this after logging in)
const userEmail = readline.question("Enter your email : ")
const token = jwt.sign({ email: userEmail }, secretKey, { expiresIn: '1h' });

// Establish connection to the chat server
const client = new net.Socket();
client.connect(5000, '127.0.0.1', () => {
    console.log('Connected to chat server');

    // Step 1: Send the JWT token for authentication
    client.write(token);
    
    // Step 2: Send a message after authentication
    setTimeout(() => {
        const email = readline.question("recepient email : ")
        const message = readline.question("message : ")
        const messageData = JSON.stringify({
            recipientEmail: email,
            content: message
        });
        
        // Send the message to the server
        client.write(messageData);
        console.log('Message sent:', messageData);
    }, 2000);  // Delay to allow authentication to complete
});

// Listen for data from the server (such as message delivery confirmations or messages)
client.on('data', (data) => {
    console.log('Server says:', data.toString());
});

// Handle errors
client.on('error', (err) => {
    console.log('Error:', err.message);
});

// Close the connection when done
client.on('close', () => {
    console.log('Connection closed');
});

// setInterval(() => {
//     const remail = readline.question("Enter the receiver's email : ")
//     const message = readline.question("Enter the message : ")

//     const messageData = JSON.stringify({
//         recipientEmail: remail,
//         content: message
//     });
    
//     // Send the message to the server
//     client.write(messageData);
//     console.log('Message sent:', messageData);
// }, 3000);