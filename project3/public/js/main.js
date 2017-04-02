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
    var questions = document.getElementById("questions");
    
    // Client side variables
    var waitingDiv = document.getElementById("waitingDiv");
    var waitingTable = document.getElementById("waitingTable");
    var waitingHostLoader = document.getElementById("waitingHostLoader");
    var waitingAnswerLoader = document.getElementById("waitingAnswerLoader");
    var waitingGuessesLoader = document.getElementById("waitingGuessesLoader");
    var timer = document.getElementById("timer");

    //HOST DIV
    var hostDiv = document.getElementById("hostDiv");
    var catDiv = document.getElementById("catDiv");
    var hostQDiv = document.getElementById("hostQDiv");
    var timerHost = document.getElementById("timerHost");

    //WRITE ANSWER DIV
    var writeAnswerDiv = document.getElementById("writeAnswerDiv");
    var questionHeader = document.getElementById("questionHeader");
    var warningMsg = document.getElementById("warningMsg");
    var answerTxt = document.getElementById("answerTxt");
    var answerSubmitBtn = document.getElementById("answerSubmitBtn");

    //GUESS DIV
    var guessAnswerDiv = document.getElementById("guessAnswerDiv");
    var answerGuessHeader = document.getElementById("answerGuessHeader");
    var guessDiv = document.getElementById("guessDiv");

    socket.emit('join', 
    { 
        gameName: gameName.value,
        numPlayers: parseInt(numPlayers.value),
        numQPR: parseInt(numQPR.value),
        playerName: playerName.value,
        categories: categories.value,
        isNewGame: isNewGame.value,
        questions: questions.value
    });

    socket.on('playerJoined', function(data)
    {
        for(var p in data.players)
        {
            var c = waitingTable.rows[parseInt(p) + 1].cells;
            c[1].innerHTML = data.players[p];
        }
    }); 

    socket.on('waitForHost', function()
    {
        //hide lobby
        waitingDiv.style.display = 'none';
        //show loader
        waitingHostLoader.style.display = 'block';
    });
    
    socket.on('hostScreen', function(data)
    {
        //hide loader
        waitingHostLoader.style.display = 'none';
        //show host div
        hostDiv.style.display = 'block';

        for (var c in data.categories)
        {
            var button = document.createElement("button");
            button.className = "btn btn-secondary";
            button.innerHTML = data.categories[c];
            button.onclick = function()
            {
                socket.emit('categoryChanged', {catName: this.innerHTML, gameName: gameName.value});
            };
            catDiv.appendChild(button);
        }
    });

    //timer
    socket.on('timer', function (data) 
    {  
        timerStart(data.countdown);
    });

    socket.on('showHostQuestions', function(data)
    {
        //clear previous questions
        hostQDiv.innerHTML = '';
        //add new questions
        for (var q in data.questions)
        {
            var button = document.createElement("button");
            button.className = "btn btn-primary";
            button.innerHTML = data.questions[q].question;
            button.onclick = function()
            {
                socket.emit('questionChosen', {question: this.innerHTML, gameName: gameName.value});
            };
            hostQDiv.appendChild(button);
        }
    });

    socket.on('writeAnswer', function(data)
    {
        //hide animation
        waitingHostLoader.style.display = 'none';
        //hide host screen
        hostDiv.style.display = 'none';
        //show write answer div
        writeAnswerDiv.style.display = 'block';
        //update divs
        questionHeader.innerHTML = data.question;

        answerSubmitBtn.onclick = function()
        {
            //check if text is null or empty
            if (answerTxt.value == "" || answerTxt.value == null)
            {
                warningMsg.style.display = 'block';
                warningMsg.innerHTML = "Please enter an answer";
                return;
            }
            socket.emit('answerSubmitted',
            {
                playerName: playerName.value,               
                gameName: gameName.value,
                answer: answerTxt.value
            });
        }
    });

    socket.on('waitForAnswers', function()
    {
        //hide answser div
        writeAnswerDiv.style.display = 'none';
        //show loader
        waitingAnswerLoader.style.display = 'block';

    });

    socket.on('guessAnswer', function(data)
    {
        //hide answer div
        writeAnswerDiv.style.display = 'none';
        //hide loader
        waitingAnswerLoader.style.display = 'none';

        guessAnswerDiv.style.display = 'block';
        guessDiv.innerHTML = '';
        answerGuessHeader.innerHTML = data.question.question;

        //i feel like the for loop is screwing up our calls. 'a' wont be defined when we call onClick right? we got away with it before since we werent using the index
        for (var a in data.answers)
        {
            var button = document.createElement("button");
            button.className = "btn btn-primary";
            button.innerHTML = data.answers[a].answer;

            if (data.answers[a].player != playerName.value)
            {
                button.onclick = function()
                {
                    //alert(this.innerHTML);

                    //var tempAns = data.answers;
                    //on scond thought im not sure if we need this inner loop or just the check against the button.innerhtml. talk to you about it later i guess. but it works!
                    for (var ans in data.answers)
                    {
                        //alert("Answer Originator: " + data.answers[ans].player + " Answer :" + data.answers[ans].answer);
                        if(data.answers[ans].answer == this.innerHTML)
                        {
                                alert("Answer Originator: " + data.answers[ans].player + " Answer :" + data.answers[ans].answer);
                        }
                    }
                            
                    
                    //alert("Answer Originator: " + data.answers[a].answer.player + " Answer :" + data.answers[a].answer);
                    //socket.emit('answerChosen', {answer: data.answers[a], gameName: gameName.value, player: playerName.value});
                };

                guessDiv.appendChild(button);
            }
        }

        
    });

    socket.on('waitForGuesses', function()
    {
        //hide quess answer div
        guessAnswerDiv.style.display = 'none';
        //show loader
        waitingGuessesLoader.style.display = 'block';
    });

    
function timerStart(countdown) {
    //----------------- TIMER ---------------------
        setInterval(function() {  
        countdown--;
        timer.innerHTML = countdown;
        timerHost.innerHTML = countdown;
        }, 1000);
}

}; //end on load


