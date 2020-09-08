const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');
const {userJoins, getCurrentUserById, userLeaves, getUsersByRoom} = require('./utils/users');

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Guess It! Bot';

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoins(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', formatMessage(botName, 'Welcome to Guess It!'));

        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(botName, `${user.username} has joined the chat!`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getUsersByRoom(user.room)
        });
    });

    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getUsersByRoom(user.room)
            });
        }


    });

    socket.on('chatMessage', msg => {
        const user = getCurrentUserById(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on Port ${PORT}`));