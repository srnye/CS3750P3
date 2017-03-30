const express = require('express');
const router = express.Router();

Question = require('../models/Question.js');

router.get('/questions', (req, res, next) => {
  Question.getQuestions((err, questions) => {
    if(err){
      res.send(err);
    }

    console.log(questions);

    res.render('manage_questions', {
      title:'Questions',
      questions: questions
    });
  });
});

router.get('/questions/add', (req, res, next) => {
  res.render('add_question', {title: 'Create Question'});
});

router.get('/questions/edit/:id', (req, res, next) => {
  Question.getQuestionById(req.params.id, (err, question) => {
    if(err){
      res.send(err);
    }
    res.render('edit_question', {
      title: 'Edit Question',
      question:question
    });
  });
  
});

module.exports = router;
