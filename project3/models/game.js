const mongoose = require('mongoose');

// Category Schema
const gameSchema = mongoose.Schema(
  {
    gameRoomName: {
      type: String,
      require: true
    },
    players: [
      { user:            
        {type: String, 
          required: true},
        playerScore:     
          {type: Number, 
            required: true}
          }],
    winner: {
      type: String,
      require: true
    },
      numQuestions: {
      type: String,
      require: true
    },
    numRounds: {
      type: Number,
      require: true
    },
    endDateTime: {
      type: Date,
      require: true
    }
  });

const Game = module.exports = mongoose.model('Game', gameSchema);

// add game
module.exports.addGame = function(game, callback){
  Game.create(game, callback);
}
