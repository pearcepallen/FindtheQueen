const express = require('express');
const socket = require('socket.io');
const FindTheQueen = require('./FindTheQueen');
// var http = require('http');


//App setup
var app = express();
var server = app.listen(7621, function(){
    console.log('listen to requests on port 7621')
});
// var server = http.createServer(app);

//Static files
app.use(express.static('public'));



let firstClient = null;

//Socket setup
var io = socket(server);
//Socket setup & pass server
io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);


    if(firstClient) {
        io.sockets.emit('message', 'Find the Queen has Commenced!')
        new FindTheQueen(firstClient, socket);
    }
    else{
        firstClient = socket;
        firstClient.emit('message', 'Waiting on opponent');
    }

    
    // // Handle chat event
    // socket.on('chat', function(data){
    //     io.sockets.emit('chat', data);
    // });

    // // Handle typing event
    // socket.on('typing', function(data){
    //     socket.broadcast.emit('typing', data);
    // });
});
