// Make connection
var socket = io.connect('http://localhost:7621');

// Query DOM
var message = document.getElementById('message'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');


['1', '2', '3'].forEach((id) => {
    var button = document.getElementById(id);
    button.addEventListener ('click', () => {
    socket.emit('choice', Number(button.value))
   });
});


socket.on('message', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data + '</strong></p>';
});



