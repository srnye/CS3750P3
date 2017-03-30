const express = require('express');
const router = express.Router();

Question = require('../models/Question.js');

//categories
//var cars = ["Movies", "People", "Dates", "Words", "Laws"];

//GET CATEGORIES 
router.get('/', (req, res, next) => {
  Question.getQuestions((err, questions) => {
    if(err){
      res.send(err);
    }

    //console.log(questions);

    res.render('categories', {
      title:'Questions',
      questions: questions
    });
  });
});

//ADD CATEGORIES POST
router.post('/edit/:id', (req, res, next) => {
  let question = new Question();
  const query = {_id: [req.params.id]}
  const update = {category: req.body.category, question: req.body.question, answer: req.body.answer}
  
  Question.updateQuestion(query, update, {}, (err, question) => {
    if(err){
      res.send(error);
    }
    res.redirect('/manage/questions');
  });
});

// edit question - POST
router.post('/add', (req, res, next) => {
  let question = new Question();
  //category.cat = req.body.cat;
  question.question = req.body.question;
  question.answer = req.body.answer;
  question.category = req.body.category;

  Question.addQuestion(question, (err, question) => {
    if(err){
      res.send(error);
    }
    res.redirect('/manage/questions');
  });
});

module.exports = router;
