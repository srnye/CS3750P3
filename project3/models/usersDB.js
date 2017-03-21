var mongoose = require('mongoose');
var schema = mongoose.Schema;
var ObjectId = schema.ObjectId;

module.exports.Users = mongoose.model('Users', new schema({
    id:             ObjectId,
    userName:       {type: String, required: '{PATH} is required.'},
    finalScore:     {type: Number, required: '{PATH} is required.'}
}));