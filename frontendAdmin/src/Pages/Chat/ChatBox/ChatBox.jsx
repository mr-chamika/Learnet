import {useState, useEffect} from "../../../../react_lite/createDOM"

function ChatApp() {
  const [socket, setSocket] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');

      // Send the JWT token for authentication
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZ20iLCJlbWFpbCI6ImdtZ2dnQGdtYWlsLmNvbSIsImlhdCI6MTcyNzA4OTA3MCwiZXhwIjoxNzI3MTc1NDcwfQ.0k1DPkeWxaz589vwGLrP62XUQ-yR9mKMnnDPLlPf0iU'; // Replace with actual token
      ws.send(token);
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
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              sender: data.sender,
              content: data.content,
              timestamp: data.timestamp,
            },
          ]);
          break;
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

  const sendMessage = () => {
    if (socket && authenticated && inputMessage.trim() !== '') {
      const messageData = {
        recipientEmail,
        content: inputMessage.trim(),
      };
      socket.send(JSON.stringify(messageData)); // Send the message to the server
      setInputMessage(''); // Clear the input
    }
  };

  function getDateTime(timestamp){
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div>
      <h2>Chat App</h2>
      <div>
        {
            messages.map((message, index) => {
                
                return (
                    <p key={index}>
                        <strong>{message.sender}:</strong> {message.content} <em>{ message.timestamp }</em>
                    </p>
                )
            })
        }
      </div>
      <input
        type="email"
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
        placeholder="Recipient's Email"
      />
      <br />
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={sendMessage} >
        Send
      </button>
    </div>
  );
}

export default ChatApp;
