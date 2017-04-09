window.onload = function() 
{
    var socket = io.connect('http://localhost:3000');

    var userName = document.getElementById('userName');
    var gameName = document.getElementById('gameName');
    var joinBtn = document.getElementById('joinBtn');
    var warningMsg = document.getElementById('warningMsg');
    var joinForm = document.getElementById('joinForm');

    var numPlayers = document.getElementById("numPlayers");
    var numQPR = document.getElementById("numQPR");
    var categories = document.getElementById("categories");
    var questions = document.getElementById("questions");

    var activeGames = [];
    var gameIndex = 0;

    warningMsg.style.display = 'none';

    socket.on('connect', function (data)
    {
        socket.emit('getActiveGames');  
    });

    socket.on('activeGames', function(data)
    {
        activeGames = data;
    });

    joinBtn.onclick = function()
    {
        //check if values are empty
        if (userName.value == null || userName.value == "")
        {
            warningMsg.style.display = 'block';
            warningMsg.innerHTML = "<strong>Please enter a name</strong>";
            return;
        }
        if (gameName.value == null || gameName.value == "")
        {
            warningMsg.style.display = 'block';
            warningMsg.innerHTML = "<strong>Please enter a game name to join</strong>";
            return;
        }
        //check to see if room exists
        if (isEmpty(activeGames))
        {
            warningMsg.style.display = 'block';
            warningMsg.innerHTML = "<strong>No rooms exist!</strong> Try creating a room";
            return;
        }
        var roomFlag = false;
        for (var r in activeGames)
        {
            if (activeGames[r].gameName == gameName.value)
            {
                roomFlag = true;
                gameIndex = r;
            }
        }
        if (roomFlag != true)
        {
            warningMsg.style.display = 'block';
            warningMsg.innerHTML = "<strong>No rooms exist with given name!</strong> Try entering a different room name.";
            return;
        }
        //check to see if user exists
        var userFlag = false;
        for (var i = 0; i < activeGames[gameIndex].players.length; i++)
        {
            if (activeGames[gameIndex].players[i].name == userName.value)
            {
                userFlag = true;
            }
        }
        if (userFlag == true)
        {
            warningMsg.style.display = 'block';
            warningMsg.innerHTML = "<strong>A user exists with this name!</strong> Try changing your name.";
            return;
        }
        //check to see if room is full
        if (activeGames[gameIndex].players.length == activeGames[gameIndex].numPlayers)
        {
            warningMsg.style.display = 'block';
            warningMsg.innerHTML = "<strong>Room is full!</strong>";
            return;
        }
        numPlayers.value = activeGames[gameIndex].numPlayers;
        numQPR.value = activeGames[gameIndex].numQPR;
        categories.value = activeGames[gameIndex].categories;
        questions.value = activeGames[gameIndex].questions;
        joinForm.submit();
    };

}; //end on load

function isEmpty(obj) 
{
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}