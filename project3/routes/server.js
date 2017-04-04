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
                questionsPlayed: 0,
                categories: obj.categories,
                players: [],
                currentHost: {},
                currentQuestion: {},
                roundsPlayed: 0,
                questions: obj.questions,
                gameInterval: 0,
                answers: [],
                playersReady: []
            };

            var player = 
            {
                name: obj.playerName, 
                score: 0, 
                socketID: socket.id
            };
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
            //TODO: get questions from db based on categories and store in array
            games[obj.gameName].questions = createQuestions(obj.categories, obj.questions);
            
            //start round
            beginRound(obj.gameName);
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

    socket.on('categoryChanged', function(obj)
    {
        var qs = [];
        var i = 0;
        for (var q in games[obj.gameName].questions)
        {
            if (i == 3)
            {
                break;
            }
            if (games[obj.gameName].questions[q].category == obj.catName)
            {
                qs.push(games[obj.gameName].questions[q]);
                i++;
            }
        }
        io.to(socket.id).emit('showHostQuestions', {questions: qs}); 
    });

    socket.on('questionChosen', function(obj)
    {
        stopTimer(obj.gameName);
        //find index of question to remove
        var index = 0;
        for (var q in games[obj.gameName].questions)
        {
            if (obj.question == games[obj.gameName].questions[q].question)
            {
                break;
            }
            index++;
        }
        //set current question
        games[obj.gameName].currentQuestion = games[obj.gameName].questions[index];
        //remove question from questions array
        games[obj.gameName].questions.splice(index,1);
        //emit question to all players (including host) in answer div
        io.in(obj.gameName).emit('writeAnswer', {question: obj.question});
    });

    socket.on('answerSubmitted', function(obj)
    {
        //update game information
        var answer = {player: obj.playerName, answer: obj.answer};
        games[obj.gameName].answers.push(answer);
        //check to see if all players submitted answers
        //if yes, send to guessing div
        if (games[obj.gameName].answers.length == games[obj.gameName].numPlayers)
        {
            var answer = {player: "", answer: games[obj.gameName].currentQuestion.answer};
            games[obj.gameName].answers.push(answer);
            io.in(obj.gameName).emit('guessAnswer', 
            {
                question: games[obj.gameName].currentQuestion,
                answers: shuffle(games[obj.gameName].answers),
                gameName: obj.gameName
            });
        }
        //if not, emit waiting div
        else
        {
            socket.emit('waitForAnswers');
        }
    });

    socket.on('answerChosen', function(obj)
    {
        //1 point if another user quesses your answer
        //2 points if you guess the correct answer
        
        //check if another player created answer
        var index = 0;
        for (var p in games[obj.gameName].players)
        {
            if (games[obj.gameName].players[p].name == obj.player)
            {
                index = p;
                break;
            }
        }
        if (obj.answer.player == "")
        {
            games[obj.gameName].players[index].score += 2;
        }
        else
        {
            index = 0;
            for (var p in games[obj.gameName].players)
            {
                if (games[obj.gameName].players[p].name == obj.answer.player)
                {
                    break;
                }
                index++;
            }
             games[obj.gameName].players[index].score += 1;
        }

        games[obj.gameName].playersReady.push(obj.player);

        if (games[obj.gameName].playersReady.length == games[obj.gameName].numPlayers)
        {
            //increment questions played
            games[obj.gameName].questionsPlayed++;

            //emit question results screen
            if (games[obj.gameName].questionsPlayed == games[obj.gameName].numQPR)
            {
                //show round results
                io.in(obj.gameName).emit('roundResults', 
                {
                    players: games[obj.gameName].players
                });
                //see if users want to play another round
                //start timer
                startRoundResultsTimer(10, obj.gameName);
                //if all players click play again, start new round
            }
            else
            {
                io.in(obj.gameName).emit('questionResults', {players: games[obj.gameName].players});
                startResultsTimer(10, obj.gameName);
            }    
        }
        else
        {
            //emit waiting screen
            socket.emit('waitForGuesses');
        }
    });

    socket.on('playAnotherRound', function(obj)
    {
        games[obj.gameName].playersReady.push(obj.name);
        if (games[obj.gameName].playersReady.length == games[obj.gameName].numPlayers)
        {
            stopTimer(obj.gameName);
            //start new round
            beginRound(obj.gameName);
        }
    });

    socket.on('leaveGame', function(obj)
    {
        //end game
        stopTimer(obj.gameName);
        //sending emit to players saying game is over
        io.in(obj.gameName).emit('gameOver', 
        {
            players: games[obj.gameName].players,
            message: "Someone left the game."
        });
        //TODO: save game data to db

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

    function createQuestions(cats, qs)
    {
        var questions = [];

        //TODO: throws error if only one category selected
        try
        {
            cats = JSON.parse(cats);
        }
        catch(err)
        {
            var tempArr = [];
            tempArr.push(cats);
            cats = tempArr;
        }
        qs = JSON.parse(qs);

        for (var c in cats)
        {
            for(var q in qs)
            {
                if (qs[q].category == cats[c])
                {
                    questions.push(qs[q]);
                }
            }
        }

        questions = shuffle(questions);
        return questions;
    }

    function shuffle(array) 
    {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) 
        {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function startHostTimer(seconds, gameName)
    {
        var countdown = seconds;
        //emit client side countdown
        io.in(gameName).emit('timer', { countdown: seconds });
        //countdown server side
        games[gameName].gameInterval = setInterval(function() 
        {  
            countdown--;
            if (countdown == 0)
            {
                stopTimer(gameName);
                //choose random question
                games[gameName].currentQuestion = games[gameName].questions[0];
                //remove question from array
                games[gameName].questions.splice(0,1);
                //emit question to all players (including host) in answer div
                io.in(gameName).emit('writeAnswer', {question: games[gameName].currentQuestion});
            }
        }, 1000);
    }

    function startResultsTimer(seconds, gameName)
    {
        var countdown = seconds;
        //emit client side countdown
        io.in(gameName).emit('questionResultsTimer', { countdown: seconds });
        //countdown server side
        games[gameName].gameInterval = setInterval(function() 
        {  
            countdown--;
            if (countdown == 0)
            {
                stopTimer(gameName);
                //clear ready array
                games[gameName].playersReady = [];

                //clear answers array
                games[gameName].answers = [];

                console.log("Host before: " + games[gameName].currentHost.name);

                //change host
                var hostIndex = games[gameName].questionsPlayed % games[gameName].numPlayers;
                var host = {name: games[gameName].players[parseInt(hostIndex)].name, socketID: games[gameName].players[parseInt(hostIndex)].socketID};
                games[gameName].currentHost = host;

                //have other players wait - show timer
                io.in(gameName).emit('waitForHost');

                var cats = [];
                try
                {
                    cats = JSON.parse(games[gameName].categories);
                }
                catch(err)
                {
                    var tempArr = [];
                    tempArr.push(games[gameName].categories);
                    cats = tempArr;
                }
                
                //have host pick question (timed)
                if (games[gameName].currentHost.socketID == socket.id)
                {
                    socket.emit('hostScreen', 
                    {
                        categories: cats,
                        questions: games[gameName].questions
                    });
                }
                else
                {
                    socket.to(games[gameName].currentHost.socketID).emit('hostScreen', 
                    {
                        categories: cats,
                        questions: games[gameName].questions
                    });
                }

                //TODO: make times constants
                startHostTimer(60, gameName);
            }
        }, 1000);
    }

    function startRoundResultsTimer(seconds, gameName)
    {
        var countdown = seconds;
        //emit client side countdown
        io.in(gameName).emit('roundResultsTimer', { countdown: seconds });

        //clear ready array
        games[gameName].playersReady = [];

        //countdown server side
        games[gameName].gameInterval = setInterval(function() 
        {  
            countdown--;
            if(countdown == 0)
            {
                //end game
                io.in(gameName).emit('gameOver', 
                {
                    players: games[gameName].players,
                    message: "Timer expired."
                });
                //TODO: save game data to db
            }
        }, 1000);
    }

    function stopTimer(gameName)
    {
        clearInterval(games[gameName].gameInterval);
    }

    function beginRound(gameName)
    {
        //set currentHost
        var host = {name: games[gameName].players[0].name, socketID: games[gameName].players[0].socketID};
        games[gameName].currentHost = host; 

        var cats = [];
        try
        {
            cats = JSON.parse(games[gameName].categories);
        }
        catch(err)
        {
            var tempArr = [];
            tempArr.push(games[gameName].categories);
            cats = tempArr;
        }

        //clear answers array
        games[gameName].answers = [];

        //clear ready array
        games[gameName].playersReady = [];

        //set questions played to 0
        games[gameName].questionsPlayed = 0;

        //have other players wait - show timer
        io.in(gameName).emit('waitForHost');
        
        //have host pick question (timed)
        if (games[gameName].currentHost.socketID == socket.id)
        {
            socket.emit('hostScreen', 
            {
                categories: cats,
                questions: games[gameName].questions
            });
        }
        else
        {
            socket.to(games[gameName].currentHost.socketID).emit('hostScreen', 
            {
                categories: cats,
                questions: games[gameName].questions
            });
        }

        //TODO: make times constants
        startHostTimer(60, gameName);
    }
});

} //end exports
