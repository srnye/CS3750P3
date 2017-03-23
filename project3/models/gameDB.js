var mongoose = require('mongoose');
var schema = mongoose.Schema;
var ObjectId = schema.ObjectId;

module.exports.Game = mongoose.model('Game', new schema({
    gameRoomName:   { type: String, required: true },
    players:        [{ user:            {type: String, required: true},
                       playerScore:     {type: Number, required: true}}],
    winner:         { type: String, required: true },
    numQuestions:   { type: Number, required: true },
    numRounds:      { type: Number, required: true },
    endDateTime:    { type: Date, required: true}
}));            