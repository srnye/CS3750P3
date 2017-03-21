var mongoose = require('mongoose');
var schema = mongoose.Schema;
var ObjectId = schema.ObjectId;

module.exports.Game = mongoose.model('Game', new schema({
    id:             ObjectId,
    gameRoomName:   { type: String, required: '{PATH} is required.' },
//players:        { type: objectId.}
    winner:         { type: String, required: '{PATH} is required.' },
    numQuestions:   { type: Number, required: '{PATH} is required.' },
  //  playersScores:  { type: String, required: '{PATH} is required.' },
    numRounds:      { type: Number, required: '{PATH} is required.' },
    endDateTime:    { type: Date, required: true}
}));