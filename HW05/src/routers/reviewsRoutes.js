const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Review = mongoose.model("Review");

router.get("/add", (req, res) => {
  res.render("add");
});

router.post("/add", async (req, res) => {
  const { courseNumber, courseName, semester, year, professor, review } =
    req.body;
  const sessionId = req.session.id;
  await Review.create({
    courseNumber,
    courseName,
    semester,
    year,
    professor,
    review,
    sessionId,
  });
  res.redirect("/");
});

router.get("/mine", async (req, res) => {
  const reviews = await Review.find({ sessionId: req.session.id });
  res.render("mine", { reviews });
});

module.exports = router;
