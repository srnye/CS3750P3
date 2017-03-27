window.onload = function() {

    var messages = [];
    var socket = io.connect('http://localhost:3000');
    // var field = document.getElementById("chat-text");
    // var sendButton = document.getElementById("send");
    // var chat = document.getElementById("chat-messages");
    // var name = document.getElementById("myName");
    // Passed in variables from game creation
    var gameName = document.getElementById("gameName");
    var numPlayers = document.getElementById("numPlayers");
    var numRounds = document.getElementById("numRounds");
    var playerName = document.getElementById("playerName");
    var categories = document.getElementById("categories");
    // Client side variables
    //field.focus();
    //var user;

    socket.emit('join', 
    { 
        gameName: gameName.value,
        numPlayers: numPlayers.value,
        numRounds: numRounds.value,
        playerName: playerName.value,
        categories: categories.value
    });

    //socket.on('disconnect', console.warn.bind(console,socket));
    //socket.emit('send',{username: 'bob'})
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += "<strong>" + (messages[i].username ? messages[i].username : 'Server') + ': </strong>';
                html += messages[i].message + '<br /><hr />';
                user = messages[i].username;
            }
            chat.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });    

    sendButton.onclick = function() {
            var text = field.value;
            socket.emit('send', { message: text, username: name.value });
            //socket.emit('send', { message: text });
            field.value = "";
            field.focus();
            
            scrollToBottom();
    }
        //what is this? -danny
    //socket.emit('send', { message: field.value });
};

function scrollToBottom() {
    document.getElementById('chat-messages').scrollTop += 1000000;
}

document.getElementById('chat-text')
    .addEventListener('keypress', function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            document.getElementById('send').click();
        }
});