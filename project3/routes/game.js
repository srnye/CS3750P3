var express = require('express');
var router = express.Router();

//variables to be set from new game
var gameName;
var numPlayers;
var numQPR; //number of questions per round
var playerName;
var cats;
var isNewGame = "false";

/* GET game creation page */
router.get('/newgame', function(req, res){
  res.render('newgame', {
    title: 'Create New Game'
  });
});

/* GET game page */
router.get('/', function(req, res){
  res.render('game', {
    title: 'Game',
    gameName: gameName,
    numPlayers: numPlayers,
    numQPR: numQPR,
    playerName: playerName,
    categories: cats,
    isNewGame: isNewGame
  });

});
/* GET game joining page */
router.get('/joingame', function(req, res){
  res.render('joingame', {
    title: 'Join Existing Game'
  });
});

/*GET game Enter Player page*/
router.get('/playerName', function(req, res){
  res.render('playerName', {
     title: 'Enter Player Name'
  })
})

// Process New Game
router.post('/newgame', (req, res, next) => {
    const gname = req.body.gname;
    const numplayers = req.body.numplayers;
    const numqpr = req.body.numqpr;
    const categories = req.body.category;
    const playername = req.body.playername;

    //check if a category is chosen
    req.checkBody('category', 'You must choose at least one category').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('newgame', {
            errors: errors
        });
    } else {
      //TODO: create new game socket with information

      gameName = gname;
      numPlayers = numplayers;
      numQPR = numqpr;
      cats = categories;
      playerName = playername;
      isNewGame = "true";

      res.redirect('/game'); //redirect to game
    }
});

// Process Join Game
router.post('/joingame', (req, res, next) => 
{
  const gname = req.body.gname;
  const playername = req.body.playername;
  const numplayers = req.body.numPlayers;
  const numqpr = req.body.numQPR;
  const categories = req.body.categories;
  let errors = req.validationErrors();

  if (errors) {
      res.render('joingame', {
          errors: errors
      });
  } else {
    //TODO: create new game socket with information

    gameName = gname;
    numPlayers = numplayers;
    numQPR = numqpr;
    cats = categories;
    playerName = playername;
    isNewGame = "false";

    res.redirect('/game'); //redirect to game
  }
});

module.exports = router;