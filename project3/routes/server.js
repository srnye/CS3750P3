module.exports = function(io) {
// var questionsRemaining = questions;
var players = [];
// var answers = [];
// var current = [];
// var choices = [];
// var running = false;
// var currentState = "";
// var currentQuestion = null;

io.on('connection', function(socket) {
    var player = addPlayer();

    console.log('a user connected');
    
    //user disconnects
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('run', function(boolean) {
        if(boolean && !running) {
            console.log('Starting...');
            io.emit('run', boolean);
            newGame();
        } else if (!boolean && running) {
            console.log('Stopping...');
            io.emit('run', boolean);
        }
    });

    socket.on('state', function(state) {
        if(state == "newCycle") {
            stateWriteAnswer()
        }
    });

    //user joins game
    socket.on('join', function(name) {
        if(searchPlayer(name) > -1) {
            console.log(name + " has rejoined!");
        } else {
            player.name = name;
            players.push(player);
            console.log(name + " has joined!");
            io.emit('newPlayer', player);
        }
        io.emit('players', players);
    });

    socket.on('addAnswer', function(obj) {
        io.emit("playerReady", obj.player);
        answers.push(obj);
        console.log("Player " + obj.player + " added answer: " + obj.answer);
    });
});

//----------------- FUNCTIONS -----------------

//function to add new user
var addPlayer = function()
{
    var player = 
    {
        username,
        score
    }

    players.push(player);
    return player;
}
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
