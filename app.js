import express from 'express';
import path from 'path';
import http from 'http';
   let io = require('socket.io');

//add configure for ui and port
const app = express();
    app.set('port', process.env.PORT || 3000);
    //path of html file
    app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', () => {
    app.use(express.errorHandler());
});

//set up express to configure the port and makes server listen to it  
const server = http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
});

//Set up socket.io to have access to the Socket.IO library
const io = require('socket.io').listen(server);

let users = []
//connexion event
// socket represents each client connected to our server
io.on('connection', (socket) => {
    socket.on('connect', () => {
        console.log("new connection socket.io : ", socket.io)})


    socket.on('disconnect', () => {
        console.log("disconnect => nickname: ", socket.nickname)
        const updateUsers = users.filter(user => user != socket.nickname)
        console.log("updateUsers : ", updateUsers)
        users = updateUsers
        io.emit("userList" , users)

    })
    //nick event
    socket.on('nick',(nickname) => {
        console.log("nick => nickname : ", nickname)
        socket.nickname = nickname
        users.push(nickname)

        console.log("server : users : ", users)

        //emit userList event to all connected sockets
        io.emit("userList", users);
    });

    //chat event
    socket.on("chat", (data) => {
        console.log("chat => nickname : ", socket.nickname)
        const d = new DataTransfer()
        const ts = d.toLocaleString()
        console.log ("ts : ", ts)
        const response = '${ts} : ${socket.nickname} : ${data.message}'
        console.log("rs: ", response)
        io.emit("chat", response)
    });
});


//Handle the nickname property for a given client
io.socket.on('connection',(socket) => {
    // set the nickname property for a given client
    Socket.on('nick', (nick) => {
       Socket.set('nickname', nick);
    });

  //reply chat data to all clients
    socket.on('chat', (data) => {
         socket.get('nickname',(err, nick) => {
            //sets user as anonymous
            let nickname = err ? 'Anonymous' : nick;

            let payload = {
                message: data.message,
                nick: nickname
            };
            //sets your backend application to display user messages on screen
            socket.emit('chat', payload);
            socket.broadcast.emit('chat',payload);
        });
    });
});