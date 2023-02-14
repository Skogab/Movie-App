const express = require("express");
morgan = require("morgan");
const app = express();

// topMovies Array
let topMovies = [
  {
    title: "Dallas Buyers Club",
    director: "Jean-Marc Vallée",
  },
  {
    title: "Twelve years a slave",
    director: "Steve McQueen",
  },
  {
    title: "Three Billboards Outside Ebbing, Missouri",
    director: "Martin McDonagh",
  },
  {
    title: "Zero Dark Thirty",
    director: "Kathryn Bigelow",
  },
  {
    title: "Moon",
    director: "Duncan Jones",
  },
  {
    title: "Enemy",
    director: "Denis Villeneuve",
  },
  {
    title: "The Tree of Life",
    director: "Terrence Malick",
  },
  {
    title: "City of God",
    director: "Fernando Meirelles",
  },
  {
    title: "Bang Boom Bang",
    director: "Peter Thorwarth",
  },
  {
    title: "Head-On",
    director: "Fatih Akin",
  },
];

// Morgan comman output
app.use(express.static("public"));
app.use(morgan("common"));

// App get root
app.get("/", (req, res) => {
  res.send("My topMovies");
});

// Json
app.get("/movies", (req, res) => {
  res.json(topMovies);
});

// Documentation
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

// Error-Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Somethin went wrong");
});

// app.listen console.log
app.listen(8080, () => {
  console.log("Your app is listening on Port 8080.");
});
