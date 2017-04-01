const mongoose = require('mongoose');

// Category Schema
const questionSchema = mongoose.Schema({
  category: {
    type: String
  },
  question: {
    type: String
  },
  answer: {
    type: String
  }
});

const Question = module.exports = mongoose.model('Question', questionSchema);

// Get questions
module.exports.getQuestions = function(callback, limit){
  Question.find(callback).limit(limit).sort([['title', 'ascending']]);
}

// add question
module.exports.addQuestion = function(question, callback){
  Question.create(question, callback);
}

// get single question by id
module.exports.getQuestionById = function(id, callback){
  Question.findById(id, callback);
}

//update question
module.exports.updateQuestion = function(query, update, options, callback){
  Question.findOneAndUpdate(query, update, options, callback);
}