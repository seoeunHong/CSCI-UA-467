// app.js
const express = require("express");
const app = express();

// set our templating system to handlebars
app.set("view engine", "hbs");

// register static file serving middleware
const path = require("path");
const { Obj } = require("prelude-ls");
app.use(express.static(path.join(__dirname, "public")));

// to parse incoming http req body in the format of name=val
// put it into req.body
app.use(express.urlencoded({ extended: false }));

const logger = (req, res, next) => {
  console.log(`Method: ${req.method} \nPath: ${req.path} \n`, req.query);
  next();
};

app.use(logger);

// route handler
app.get("/", (req, res) => {
  res.redirect("/editor");
});

app.get("/editor", (req, res) => {
  res.render("editor");
});

app.post("/editor", (req, res) => {
  let wordslist = req.body.message.split(" ");
  wordslist = wordslist.map((word) => {
    const targetKaomoji = kaomojis.filter((kaomoji) => {
      return kaomoji.emotions.includes(word.toLowerCase());
    });

    if (targetKaomoji.length !== 0) {
      return targetKaomoji[0].value;
    }

    return word;
  });

  wordslist = wordslist.join(" ");
  res.render("editor", { originalText: req.body.message, words: wordslist });
});

app.get("/dictionary", (req, res) => {
  // Filter and show Data by given input
  // If there is no input, just show original data

  let filteredData = { kaomojiData: kaomojis };
  if (Object.hasOwnProperty.call(req.query, "emotion")) {
    //req.query contains ?name=val {name: val}
    const targetEmotion = req.query.emotion;
    filteredData = {
      kaomojiData: kaomojis.filter(
        (kaomoji) =>
          kaomoji.emotions.includes(targetEmotion) || targetEmotion == ""
      ),
    };
  }
  res.render("list", filteredData);
});

app.post("/dictionary", (req, res) => {
  //console.log(req.body);
  let originData = kaomojis;
  // Add value when req.body has value for both input
  if (!(req.body.value == "" || req.body.emotions == "")) {
    const newData = new Kaomoji(req.body.value, req.body.emotions);
    originData.push(newData);
  }
  res.redirect("/dictionary");
});

// Store initial data as Array of Kaomoji instances
const { init, Kaomoji } = require("./kaomoji.js");

let kaomojis = [];

init(kaomojis, "code-samples/kaomojiData.json", () => {
  app.listen(3000, () =>
    console.log(
      "Server started at http://localhost:3000; type CTRL+C to shut down \n "
      //kaomojis
    )
  );
});
