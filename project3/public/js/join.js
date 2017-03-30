window.onload = function() 
{
    var socket = io.connect('http://localhost:3000');

    var userName = document.getElementById('userName');
    var gameName = document.getElementById('gameName');
    var joinBtn = document.getElementById('joinBtn');
    var warningMsg = document.getElementById('warningMsg');
    var joinForm = document.getElementById('joinForm');

    var activeGames = {};

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
            if (r == gameName.value)
            {
                roomFlag = true;
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
        for (var i = 0; i < activeGames[gameName.value].players.length; i++)
        {
            if (activeGames[gameName.value].players[i] == userName.value)
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
        if (activeGames[gameName.value].players.length == activeGames[gameName.value].numPlayers)
        {
            warningMsg.style.display = 'block';
            warningMsg.innerHTML = "<strong>Room is full!</strong>";
            return;
        }
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