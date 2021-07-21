const express = require('express');
const socket = require('socket.io');
const bodyparser = require('body-parser');
const FindTheQueen = require('./FindTheQueen');
const UserController = require('./controllers/UserController');


//App setup
const app = express();
const server = app.listen(7621, function(){
  console.log('listen to requests on port 7621')
});


//Static files
app.use(express.static('public'));


app.use(bodyparser.urlencoded({
  extended: true
}))

app.use(bodyparser.json());
app.use('/user', UserController);



let firstClient = null;

//Socket setup
const io = socket(server);
//Socket setup & pass server
io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);

    if(firstClient) {
        io.sockets.emit('message', 'Find the Queen has Commenced!')
        new FindTheQueen(firstClient, socket);
        firstClient = null;
        
    }
    else{
        firstClient = socket;
        firstClient.emit('message', 'Waiting on opponent');
    }
});
