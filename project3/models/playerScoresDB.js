var mongoose = require('mongoose');
var schema = mongoose.Schema;
var ObjectId = schema.ObjectId;

module.exports.Game = mongoose.model('Game', new schema({
    id:             ObjectId,
    UserName:       { type: Schema.Types.ObjectId, ref: 'Users' },
    playerScore:    { type: Number, required: true}
}));