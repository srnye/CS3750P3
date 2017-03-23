var mongoose = require('mongoose');
var schema = mongoose.Schema;
var ObjectId = schema.ObjectId;

//question and answer schema
module.exports.questionAnswer = mongoose.model('questionAnswer', new schema({
    id:             ObjectId,
    question:       {type: String, required: '{PATH} is required.'},
    answer:         {type: String, required:'{PATH} is required.'},
    category:       {type: String, required:'{PATH} is required.'}
}));