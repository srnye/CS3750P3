var express = require('express');
var router = express.Router();

/* GET question center page */
router.get('/questioncenter', function(req, res){
  res.render('questioncenter', {
    title: 'Question Center'
  });
});

module.exports = router;