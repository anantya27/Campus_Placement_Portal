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
// const { PeerServer } = require("peer");
// const peerServer = PeerServer({ port: 9000, path: "/myapp" });


app.set('view engine','ejs');
app.use(express.static('public'));

app.use('/peerjs',peerServer);

app.get('/',(req,res)=>{

    res.status(200).send("Hello World!");
} )

let roomIdGlobal;

io.on('connection', socket => {

    // console.log(socket.id);

    socket.on('join-room', (roomId,userId) => {
        
        roomIdGlobal=roomId;
        // console.log("joined room");
        socket.join(roomId);
        socket.to(roomId).emit('user-connected',userId);
        // console.log("joined room");

        // socket.on('test',()=>{
        //     console.log("test done!!!!!!!!!!1")
        // });

        socket.on('message', (message) => {
            //send message to the same room
            console.log("on Server>>>>>",message);
            io.to(roomId).emit('createMessage', message);
        }); 
    }); 

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


server.listen(3030);    