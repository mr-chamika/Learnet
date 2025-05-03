const WebSocket = require('ws');
const https = require("https");
const http = require("http");
const fs = require("fs")
const jwt = require('jsonwebtoken');

class WebSocketServer{
    #handlers
    // Map to track online users by email
    #onlineUsers = {}; // { email: ws }
    #server

    constructor(isSecure, certPath = null, keyPath = null){
        this.#handlers = {}
        
        let server
        if(isSecure && certPath && keyPath){
            server = https.createServer({
                cert: fs.readFileSync(certPath),
                key: fs.readFileSync(keyPath),
            });
        }else{
            server = http.createServer()
        }
        this.#server = server

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
        this.wss.on('connection', async (ws) => {

            ws.isAuthenticated = false
            ws.decodedUser = null

            ws.on("open", async ()=>{
                console.log("New connection")
            })

            ws.on('message', async (data) => {
                // console.log("New message")
                const parsedData = JSON.parse(data)
                // console.log("data : ", parsedData)
                console.log("type : ", parsedData.type)
                if(parsedData.type){
                    const handler = this.#handlers[parsedData.type]
                    if(handler){
                        await handler(parsedData.data, ws, this)
                    }
                }else{
                    // ws.close(401, JSON.stringify({Error: "Message type provided is not supported."}))
                    ws.send(JSON.stringify({ type: 'error', message: 'Message type provided is not supported.' }));
                }
            })
            
            // Handle when the user disconnects
            ws.on('close', async () => {
                if (ws.isAuthenticated && ws.decodedUser) {
                    this.removeOnlineUser(ws.decodedUser.userId)
                    console.log(`${ws.decodedUser.email} has gone offline`);
                }
            })
    
            ws.on('error', async (err) => {
                console.log('Connection error:', err.message);
            })
        })

        // Start the HTTPS server and WebSocket server
        this.#server.listen(5000, () => {
            console.log('Secure WebSocket chat server running on port 5000');
        });

    }

    isUserOnline(userId){
        if(this.#onlineUsers[userId]){
            return true
        }
        return false
    }

    setSocketOfUser(userId, socket){
        this.#onlineUsers[userId] = socket
    }

    getSocketOfUser(userId){
        return this.#onlineUsers[userId]
    }

    removeOnlineUser(userId){
        delete this.#onlineUsers[userId]
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

module.exports = WebSocketServer