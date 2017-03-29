module.exports = function(io) {
// var questionsRemaining = questions;
//var players = [];
//var games = [];
var games = {};
// var answers = [];
// var current = [];
// var choices = [];
// var running = false;
// var currentState = "";
// var currentQuestion = null;

io.sockets.on('connection', function(socket) {

    console.log('a user connected');
    
    //user disconnects
    socket.on('disconnect', function() {
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
                numRounds: obj.numRounds,
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

function newGame() {
    io.emit("gameStatus", "waitPlayers");
    setTimeout(function() {
        stateWriteAnswer();
    }, 10000)
}

function stateWriteAnswer() {
    if (currentState != "writeAnswer") {
        currentState = "writeAnswer";
        var questionIndex = randomInt(0, questionsRemaining.length - 1);
        currentQuestion = questionsRemaining[questionIndex];
        questionsRemaining.splice(questionIndex, 1);
        console.log(currentQuestion.text);
        io.emit("gameStatus", "writeAnswer");
        io.emit("question", currentQuestion);
        setTimeout(function () {
            stateGuessAnswer()
        }, 10000)
    }
}

function stateGuessAnswer() {
    if (currentState != "guessAnswer") {
        currentState = "guessAnswer";
        io.emit("gameStatus", "guessAnswer");
        console.log("Try to guess!");
        answers.push({answer: currentQuestion.answer});
        io.emit("answers", answers);
        setTimeout(function () {
            stateEndCycle()
        }, 10000)
    }
}

function stateEndCycle() {
    if (currentState != "endCycle") {
        console.log("Ending cycle!");
        currentState = "endCycle";
        io.emit("gameStatus", "endCycle");
    }
}

function searchPlayer(name) {
    for(var i = 0; i < players.length; i++) {
        if(players[i].name == name) {
            return i
        }
    }
    return -1
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

// http.listen(3000, function(){
//     console.log('listening on *:3000');
// });
}
