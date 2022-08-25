// app.js
const webby = require("./webby.js");
const path = require("path");
const { styles } = require("ansi-colors");
const app = new webby.App();

app.use(webby.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.send(
    '<html><head><link rel="stylesheet" href="/css/styles.css"></head><body><div id = header><h1>Check out my cute rabbits</h1></div><div id = link><a href="/gallery" target="_self">Let me see some cute rabbits</a></div></body></html>'
  );
});

app.get("/gallery", (req, res) => {
  // generate random number from 1 to 4
  let randomNumOfImg = Math.floor(Math.random() * 4) + 1;
  let bodyString = "";
  if (randomNumOfImg === 1) {
    bodyString += `<div id = header> <h1> Here is ${randomNumOfImg} rabbit! </h1></div>`;
  } else {
    bodyString += `<div id = header> <h1> Here are ${randomNumOfImg} rabbits! </h1></div>`;
  }

  for (let i = 1; i <= randomNumOfImg; i++) {
    let imageSource = `<img src = '/img/animal${i}.jpeg' width = '30%' height = '45%'/>`;
    bodyString += imageSource;
  }
  res.send(
    `<html><head><link rel = "stylesheet" href= "/css/styles.css"></head> <body> ${bodyString} </body> </html>`
  );
});

app.get("/pics", (req, res) => {
  res.status(308);
  res.set("Location", "/gallery");
  res.send("");
});

app.listen(3000, "127.0.0.1");
