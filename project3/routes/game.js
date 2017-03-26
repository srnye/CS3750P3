var express = require('express');
var router = express.Router();

/* GET game creation page */
router.get('/newgame', function(req, res){
  res.render('newgame', {
    title: 'Create New Game'
  });
});

/* GET game creation page */
router.get('/', function(req, res){
  res.render('game', {
    title: 'Game'
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
    const numrounds = req.body.numrounds;
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
        res.redirect('/game'); //redirect to game
    }
});

module.exports = router;