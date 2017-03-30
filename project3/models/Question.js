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

// Get Categories
module.exports.getQuestions = function(callback, limit){
  Question.find(callback).limit(limit).sort([['title', 'ascending']]);
}

// add category
module.exports.addQuestion = function(question, callback){
  Question.create(question, callback);
}

// get single category by id
module.exports.getQuestionById = function(id, callback){
  Question.findById(id, callback);
}

//update category
module.exports.updateQuestion = function(query, update, options, callback){
  Question.findOneAndUpdate(query, update, options, callback);
}