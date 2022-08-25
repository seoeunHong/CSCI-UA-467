const mongoose = require("mongoose");

// TODO: create schema and register models

// my Schema goes here!
const reviewSchema = new mongoose.Schema({
  courseNumber: { type: String },
  courseName: { type: String },
  semester: { type: String },
  year: { type: Number },
  professor: { type: String },
  review: { type: String },
  sessionId: { type: String },
});

mongoose.model("Review", reviewSchema);

const mongooseOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect("mongodb://localhost/hw05", mongooseOpts, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to database");
  }
});
