// app.js
require('./db.js');
const mongoose = require('mongoose');
const Result = mongoose.model('Result');
const express = require('express');
const app = express();
const path = require('path');

const publicPath = path.resolve(__dirname, 'public');
//console.log(publicPath);
app.use(express.static(publicPath));

// body parser (req.body)
app.use(express.urlencoded({extended: false}));

const PORT = 3000;

app.get('/', async (req, res) => {
  let result = await Result.find().sort({$natural: 1}).limit(5);
  console.log(result);
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/', async (req, res) => {
  const {playerInitial, playerScore, comp, compScore} = req.body;
  await Result.create({
    playerInitial,
    playerScore,
    comp,
    compScore,
  });
  res.redirect('/');
});

app.listen(PORT, () => console.log(`✅ Server Listening on port http://localhost:${PORT} 💻`));
