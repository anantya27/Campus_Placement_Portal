const express = require('express');
const app = express();
const server=require('http').Server(app);
const io = require('socket.io')(server, {
    cors: { origin: "*" }
});// socket io is for real time communiccation it creates a chanel for commun
//through this server also sends request making a chanel for communication
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
}); 
const spawn = require('child_process').spawn;
// const { PeerServer } = require("peer");
// const peerServer = PeerServer({ port: 9000, path: "/myapp" });


app.set('view engine','ejs');
app.use(express.static('public'));

app.use('/peerjs',peerServer);

app.get('/',(req,res)=>{

    res.status(200).send("Hello World!");
} )

let roomIdGlobal;
const userSocketMap ={};

function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', socket => {

    // console.log(socket.id);

    // socket.on("connection",()=>{
    //     console.log("connection established");
    // });

    socket.on('join-room', (roomId,userId,username) => {
        
        roomIdGlobal=roomId;
        // console.log("joined room");
        socket.join(roomId);
        socket.to(roomId).emit('user-connected',userId,username);
        // console.log("joined room");

        // socket.on('test',()=>{
        //     socket.to(roomId).emit('testing');
        //     console.log("test done!!!!!!!!!!1",roomId)
        // });


        socket.on('message', (username,message) => {
            //send message to the same room
            console.log("on Server>>>>>",message);
            io.to(roomId).emit('createMessage',username, message);
        }); 

        socket.on("canvas-data",(data)=>{
            // console.log("data recived");
            socket.to(roomId).emit('canvas-data',data);
        });
    }); 

    socket.on("ide-join",({roomId,username})=>{
        userSocketMap[socket.id]=username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit("user-joined", {
                clients,
                username,
                socketId: socket.id,
            });
        });
    })

    socket.on("code-change", ({ roomId, code }) => {
        socket.in(roomId).emit("code-change", { code });
    });

    socket.on("sync-code", ({ socketId, code }) => {
        io.to(socketId).emit("code-change", { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit("disconnected", {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });

    // socket.on('test',()=>{
    //     socket.to(roomIdGlobal).emit('testing');
    //     console.log("test done!!!!!!!!!!1",roomIdGlobal)
    // });

    // socket.on("canvas-data",(data)=>{
    //     console.log("data recived");
    //     socket.to(roomIdGlobal).emit('canvas-data',data);
    // });

    // socket.on('test',()=>{
    //     console.log("test done!!!!!!!!!!1")
    // });
    // socket.on('message', (message) => {
    //     //send message to the same room
    //     console.log("on Server>>>>>",message);
    //     io.to(roomIdGlobal).emit('createMessage', message);
    // }); 

    // socket.on('join-room', (roomId,userId) => {
    //     // console.log("joined room");
    //     socket.join(roomId)
    //     // if(socket.to(roomId).broadcast){
    //     // console.log(socket.to(roomId));
    //     socket.to(roomId).emit('user-connected',userId);
    //     // // }
        
    //     // // messages
    //     socket.on('message', (message) => {
    //         //send message to the same room
    //         io.to(roomId).emit('createMessage', message);
    //     }); 
        
    // }); 



})

const PORT = process.env.PORT || 3030;
server.listen(PORT);    