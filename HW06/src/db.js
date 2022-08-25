const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  playerInitial: {type: String, default: 'Player'},
  playerScore: {type: Number},
  computer: {type: String, default: 'Computer'},
  computerScore: {type: Number},
});

mongoose.model('Result', resultSchema);

mongoose.connect('mongodb://localhost/hw06', err => {
  if (err) {
    console.log(err);
  } else {
    console.log('✅ Connected to Database');
  }
});
