module.exports = function(io) 
{

// Global dictionary to hold all game information - FORMAT {KEY (game name) : VALUE (game object with all variables needed)}
var games = {};

io.sockets.on('connection', function(socket) 
{
    console.log('a user connected');
    
    //user disconnects
    socket.on('disconnect', function() 
    {
        console.log('user disconnected');
    });

    //user joins or creates game
    socket.on('join', function(obj) 
    {
        socket.join(obj.gameName);
        //TODO: determine if joining room or creating room
        if (obj.isNewGame == "true")
        {
            var game = 
            {
                //gameName: obj.gameName,
                numPlayers: obj.numPlayers,
                numQPR: obj.numQPR,
                categories: obj.categories,
                players: []
            }
            game.players.push(obj.playerName);
            //games.push(game);
            games[obj.gameName] = game;
        }
        else
        {
            for (var key in games)
            {
                if(obj.gameName == key)
                {
                    var game = games[key];
                    game.players.push(obj.playerName);
                }
            }
        }
        if (io.sockets.adapter.sids[socket.id][obj.gameName] == true)
        {
            console.log("Youre in the room");
        }
    });

    socket.on('getActiveGames', (callback) =>
    {
        console.log("received emit on server");
        io.to(socket.id).emit('activeGames', games); 
    });
});

//----------------- FUNCTIONS -----------------

function searchPlayer(name) 
{
    for(var i = 0; i < players.length; i++) {
        if(players[i].name == name) {
            return i
        }
    }
    return -1
}

function randomInt (low, high) 
{
    return Math.floor(Math.random() * (high - low) + low);
}

}
