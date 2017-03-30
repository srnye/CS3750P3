window.onload = function() 
{
    var messages = [];
    var socket = io.connect('http://localhost:3000');
    // var field = document.getElementById("chat-text");
    // var sendButton = document.getElementById("send");
    // var chat = document.getElementById("chat-messages");
    // var name = document.getElementById("myName");
    // Passed in variables from game creation
    var gameName = document.getElementById("gameName");
    var numPlayers = document.getElementById("numPlayers");
    var numQPR = document.getElementById("numQPR");
    var playerName = document.getElementById("playerName");
    var categories = document.getElementById("categories");
    var isNewGame = document.getElementById("isNewGame");
    // Client side variables
    //field.focus();
    //var user;

    socket.emit('join', 
    { 
        gameName: gameName.value,
        numPlayers: parseInt(numPlayers.value),
        numQPR: parseInt(numQPR.value),
        playerName: playerName.value,
        categories: categories.value,
        isNewGame: isNewGame.value
    });  

}; //end on load
