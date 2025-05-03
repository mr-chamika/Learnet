const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

// Example JWT token creation (this would typically come from a login or another process)
const secretKey = 'JKLDSJFLIR932749&*%&%&^&^%';
const token = jwt.sign({ email: 'user2@example.com' }, secretKey, { expiresIn: '1h' });

// Create WebSocket client connection to the WebSocket server
const ws = new WebSocket('ws://localhost:5000');

// When the WebSocket connection opens
ws.on('open', () => {
    console.log('Connected to WebSocket server');
    
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
            recipientEmail,
            content
        });
        ws.send(message);
    } else {
        console.log('WebSocket is not open');
    }
}

// Example usage: Sending a message to a recipient
setTimeout(() => {
    sendMessage('gmggg@gmail.com', 'Hello, this is a test message from the Node.js client.');
}, 2000); // Delay to ensure the connection is established before sending a message
