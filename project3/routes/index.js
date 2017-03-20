var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Balderdash' });
});

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

module.exports = router;
