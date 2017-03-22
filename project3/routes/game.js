var express = require('express');
var router = express.Router();

/* GET game creation page */
router.get('/newgame', function(req, res){
  res.render('newgame', {
    title: 'Create New Game'
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
     title: 'Please Enter Player Name'
  })
})

// Process New Game
router.post('/newgame', (req, res, next) => {
    const gname = req.body.gname;
    const numplayers = req.body.numplayers;
    const numrounds = req.body.numrounds;
    const categories = req.body.category;
    //TODO: add categories

    req.checkBody('gname', 'Game name field is required').notEmpty();
    req.checkBody('numplayers', 'Number of players field is required').notEmpty();
    req.checkBody('numrounds', 'Number of rounds field is required').notEmpty();
    req.checkBody('numplayers', 'Player count can only be numeric and from 4-9').matches(/^[4-9]$/i);
    req.checkBody('numrounds', 'Round count can only be numeric and from 1-9').matches(/^[1-9]$/i);
    req.checkBody('category', 'You must choose at least one category').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('newgame', {
            errors: errors
        });
    } else {
        //TODO: create new game db schema?
        //TODO: add game to game collection?
        res.redirect('/'); //debug - redirect to game
    }
});

module.exports = router;