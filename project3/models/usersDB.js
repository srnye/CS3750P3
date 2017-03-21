var mongoose = require('mongoose');
var schema = mongoose.Schema;

module.exports.users = mongoose.model('Users', new schema({
    userName:       {type: String, required: '{PATH} is required.'},
    finalScore:     {type: Number, required: '{PATH} is required.'}
}));