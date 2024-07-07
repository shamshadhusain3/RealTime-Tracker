const express = require('express');
const app = express();
const port = 3000;

const socket = require('socket.io');
const http = require('http');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socket(server);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Middleware to parse JSON bodies
app.use(express.json());

// Define a simple route
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("send-location",(data)=>{
        io.emit("receive-location", {id:socket.id,...data});

        console.log(data);

    })
    socket.on("disconnect",()=>{
        io.emit("user-disconnected",socket.id)
    })

});

app.get('/', (req, res) => {
    res.render('index');
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
