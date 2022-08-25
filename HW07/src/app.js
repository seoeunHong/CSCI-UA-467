const DEFAULT_AIT_PORT = 3000;

// database setup
require('./db');
const mongoose = require('mongoose');

// express
const express = require('express');
const app = express();

// static files
const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// body parser
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'hbs');

//body parser for json body
app.use(express.json());

const Review = mongoose.model('Review');

app.get('/api/reviews', async function (req, res) {
  // TODO: retrieve all reviews or use filters coming in from req.query
  // send back as JSON list
  let reviews;
  const {semester, year, professor} = req.query;
  if (semester === undefined && year === undefined && professor === undefined) {
    reviews = await Review.find({});
  } else {
    let conditions = {semester, year, professor};
    const keys = Object.keys(conditions);
    keys.forEach(key => {
      if (conditions[key] === '') delete conditions[key];
    });
    reviews = await Review.find(conditions);
  }
  const data = reviews.map(m => {
    return {
      name: m.name,
      semester: m.semester,
      year: m.year,
      professor: m.professor,
      review: m.review,
    };
  });
  res.json(data);
});

app.post('/api/review/create', async (req, res) => {
  // TODO: create new review... if save succeeds, send back JSON
  // representation of saved object
  const {name, semester, year, professor, review} = req.body;
  const saved = await new Review({name, semester, year, professor, review}).save();
  res.send(saved);
});

app.listen(process.env.PORT || DEFAULT_AIT_PORT, err => {
  console.log(`✅ Server Listening on port http://localhost:${process.env.PORT || DEFAULT_AIT_PORT} 💻`);
  console.log('Server started (ctrl + c to shut down)');
});
