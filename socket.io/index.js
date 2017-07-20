var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

let messages = [];
let users = {};
let clients = [];
let status = ['justEnter', 'online', 'offline'];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/script.js', function(req, res) {
    res.sendFile(__dirname + '/script.js');
});

app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + '/style.css');
});

app.use('/img', express.static(__dirname + '/img'));



io.on('connection', function(socket) {
    console.info('New client connected (id=' + socket.id + ').');
    clients.push(socket);

    socket.on('disconnect', function() {
        var index = clients.indexOf(socket);
        if (index != -1) {
            clients.splice(index, 1);
            console.info('Client gone (id=' + socket.id + ').');
        }
        let currUser = users[socket.id];
        if( currUser ) {
            currUser.status = status[2];
            io.emit('change status', currUser);
        }
            
    });
    socket.emit('all users', users);



    socket.on('user added', function(user) {
        user.id = socket.id;
        users[socket.id] = user;
        user.status = status[0];

        setTimeout( function (){
            user.status = status[1];
            io.emit('change status', user);
        }, 60000);
        io.emit('change status', user);
        io.emit('user added', user, socket.id);
    });

    socket.on('chat message', function(msg) {
        //msg.userId = user.id;
        // for (let i in users) {
        //     var patt = new RegExp('@' + user[i].nickName, 'i');
        //     if (patt.test(msg.text)) {
        //         msg.
        //     }
            
        // }
        messages.push(msg);
        io.emit('chat message', msg, users);
    })
    socket.emit('chat history', messages, users);

    socket.on('typing', function(type) {
        io.emit('typing', type);
    })
});    


http.listen(3000, function() {
    console.log("listening on *:3000");
});
