const express = require('express');
const router = express.Router();

Question = require('../models/Question.js');

router.get('/questions', (req, res, next) => {
  Question.getQuestions((err, questions) => {
    if(err){
      res.send(err);
    }

    console.log(questions);

    var definitionsCat = 0;
    var famousCat = 0;
    var acronymsCat = 0;
    var movieCat = 0;
    var ludicrousCat = 0;
    var a = "testString";

    for (i = 0; i < questions.length; i++) { 
      if(questions[i].category == "Definitions"){
        definitionsCat++;
      }else if(questions[i].category == "Famous People"){
        famousCat++;
      }else if(questions[i].category == "Acronyms"){
        acronymsCat++;
      }else if(questions[i].category == "Movie Headlines"){
        movieCat++;
      }else if(questions[i].category == "Ludicrous Laws"){
        ludicrousCat++;
      }
    }

    res.render('manage_questions', {
      title:'Questions',
      questions: questions,
      
      dCat : definitionsCat,
      fCat : famousCat,
      aCat : acronymsCat,
      mCat : movieCat,
      lCat : ludicrousCat
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
