window.onload = function() 
{
    var messages = [];
    var socket = io.connect('http://localhost:3000');

    // Passed in variables from game creation (HIDDEN)
    var gameName = document.getElementById("gameName");
    var numPlayers = document.getElementById("numPlayers");
    var numQPR = document.getElementById("numQPR");
    var playerName = document.getElementById("playerName");
    var categories = document.getElementById("categories");
    var isNewGame = document.getElementById("isNewGame");
    
    // Client side variables
    var waitingDiv = document.getElementById("waitingDiv");
    var waitingTable = document.getElementById("waitingTable");

    socket.emit('join', 
    { 
        gameName: gameName.value,
        numPlayers: parseInt(numPlayers.value),
        numQPR: parseInt(numQPR.value),
        playerName: playerName.value,
        categories: categories.value,
        isNewGame: isNewGame.value
    });

    socket.on('playerJoined', function(data)
    {
        for(var p in data.players)
        {
            var c = waitingTable.rows[parseInt(p) + 1].cells;
            c[1].innerHTML = data.players[p];
        }
    }); 

}; //end on load
