var mongoose = require('mongoose');
var schema = mongoose.Schema;

//question and answer schema
module.exports.questionAnswer = mongoose.model('questionAnswer', new schema({
    question:       {type: String, required: '{PATH} is required.'},
    answer:         {type: String, required:'{PATH} is required.'},
    category:       {type: String, required:'{PATH} is required.'}
}));