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
        // determine if joining room or creating room
        if (obj.isNewGame == "true")
        {
            var game = 
            {
                //gameName: obj.gameName,
                numPlayers: obj.numPlayers,
                numQPR: obj.numQPR,
                categories: obj.categories,
                players: [],
                currentHost: {},
                roundsPlayed: 0,
            };

            var player = {name: obj.playerName, score: 0, socketID: socket.id};
            game.players.push(player);
            games[obj.gameName] = game;
        }
        else
        {
            for (var key in games)
            {
                if(obj.gameName == key)
                {
                    var game = games[key];
                    var player = {name: obj.playerName, score: 0, socketID: socket.id};
                    game.players.push(player);
                }
            }
        }
        if (io.sockets.adapter.sids[socket.id][obj.gameName] == true)
        {
            console.log("Youre in room: " + obj.gameName);
        }
        //send back player join information
        //check if all players have joined
        if (games[obj.gameName].players.length == games[obj.gameName].numPlayers)
        {
            //TODO: start game
            //set currentHost
            var host = {name: games[obj.gameName].players[0].name, socketID: games[obj.gameName].players[0].socketID};
            games[obj.gameName].currentHost = host;
            //have other players wait
            io.in(obj.gameName).emit('waitForHost');

            //----------------- TIMER ---------------------

            var countdown = 60;
            setInterval(function() {  
            countdown--;
            io.in(obj.gameName).emit('timer', { countdown: countdown });
            }, 1000);
        
            //TODO: have host pick question
        }
        //if not, update waiting lobby
        else
        {
            var playerArr = [];
            for(var p in games[obj.gameName].players)
            {
                playerArr.push(games[obj.gameName].players[p].name);
            }
            io.in(obj.gameName).emit('playerJoined', 
            {
                players: playerArr
            });
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
