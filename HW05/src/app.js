require("./db.js");
const mongoose = require("mongoose");
const Review = mongoose.model("Review");

const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");

const reviewsRoutes = require("./routers/reviewsRoutes");

const publicPath = path.resolve(__dirname, "../public");
console.log(publicPath);
app.use(express.static(publicPath));

app.set("view engine", "hbs");

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret for signing session id",
    saveUninitialized: false,
    resave: false,
  })
);

app.use((req, res, next) => {
  req.session.count = req.session.count + 1 || 1;
  next();
});

app.use((req, res, next) => {
  res.locals.count = req.session.count;
  next();
});

app.get("/", async (req, res) => {
  const { semester, year, professor } = req.query;
  let reviews = await Review.find({});
  const exists = await Review.exists({
    $or: [{ semester }, { year }, { professor }],
  });
  if (exists) {
    let conditions = { semester, year, professor };
    const keys = Object.keys(conditions);
    keys.forEach((key) => {
      if (conditions[key] === "") delete conditions[key];
    });
    reviews = await Review.find(conditions);
  }
  res.render("homepage", { reviews });
});

app.use("/reviews", reviewsRoutes);

app.listen(process.env.PORT || 3000);
