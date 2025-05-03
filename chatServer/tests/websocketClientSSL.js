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
const token = jwt.sign({ userId: "111111111111111111111114", email: 'user3@example.com' }, secretKey, { expiresIn: '1h' });

// Create a secure WebSocket connection using wss://
const ws = new WebSocket('wss://localhost:5000',{
    agent: new https.Agent(options)
});

// When the WebSocket connection opens
ws.on('open', () => {
    console.log('Connected to secure WebSocket server');

    // Send the JWT token to authenticate
    ws.send(token);
});

// Handle incoming messages from the server
ws.on('message', (data) => {
    console.log(`Received from server: ${data}`);
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
function sendMessage(recipientEmail, content) {
    if (ws.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({
            receiverUserId: "111111111111111111111113",
            message: "Forth - Hello, World!"
        });
        ws.send(message);
    } else {
        console.log('WebSocket is not open');
    }
}

// Example usage: Sending a message to a recipient
setTimeout(() => {
    sendMessage('gmggg@gmail.com', 'Hello, this is a secure test message from the Node.js client.');
}, 2000);  // Delay to ensure the connection is established before sending a message
