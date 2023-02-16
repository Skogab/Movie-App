const express = require("express");
(app = express()),
  (morgan = require("morgan")),
  (bodyParser = require("body-parser")),
  (uuid = require("uuid"));

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(morgan("common"));

// users Array
let users = [
  {
    id: "1",
    name: "Marcus",
    favoriteMovie: [],
  },
  {
    id: "2",
    name: "Jane",
    favoriteMovie: ["Moon"],
  },
  {
    id: "3",
    name: "Anna",
    favoriteMovie: ["Enemy"],
  },
];

// Movies Array
let movies = [
  {
    title: "Dallas Buyers Club",
    genre: "Drama",
    director: {
      name: "Jean-Marc Vallée",
      bio: "placeholder bio",
      birth: "1963",
    },
  },
  {
    title: "Twelve years a slave",
    genre: "Drama",
    director: {
      name: "Steve McQueen",
      bio: "placeholder bio",
      birth: "1975",
    },
  },
  {
    title: "Three Billboards Outside Ebbing, Missouri",
    genre: "Drama",
    director: {
      name: "Martin McDonagh",
      bio: "placeholder bio",
      birth: "1958",
    },
  },
  {
    title: "Zero Dark Thirty",
    genre: "Drama",
    director: {
      name: "Kathryn Bigelow",
      bio: "placeholder bio",
      birth: "1964",
    },
  },
  {
    title: "Moon",
    genre: "Action",
    director: {
      name: "Duncan Jones",
      bio: "placeholder bio",
      birth: "1981",
    },
  },
  {
    title: "Enemy",
    genre: "Thriller",
    director: {
      name: "Denis Villeneuve",
      bio: "placeholder bio",
      birth: "1971",
    },
  },
  {
    title: "The Tree of Life",
    genre: "Drama",
    director: {
      name: "Terrence Malick",
      bio: "placeholder bio",
      birth: "1954",
    },
  },
  {
    title: "City of God",
    genre: "Drama",
    director: {
      name: "Fernando Meirelles",
      bio: "placeholder bio",
      birth: "1985",
    },
  },
  {
    title: "Bang Boom Bang",
    genre: "Comedy",
    director: {
      name: "Peter Thorwarth",
      bio: "placeholder bio",
      birth: "1982",
    },
  },
  {
    title: "Head-On",
    genre: "Drama",
    director: {
      name: "Fatih Akin",
      bio: "placeholder bio",
      birth: "1976",
    },
  },
];

//CREATE
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("User needs a name");
  }
});

//UPDATE update user
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("No such user in Databse");
  }
});

//CREATE create movietitle
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovie.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send("no such user");
  }
});

//DELETE delete a movie
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovie = user.favoriteMovie.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send("no such user");
  }
});

//DELETE deltet a user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    //res.json(users)
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send("No such User in Database");
  }
});

//READ (GET requests)
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

// Get get movie by title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("No such Movie in Database");
  }
});

// GEt Movie by Genre
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genreMovies = movies.filter((movie) => movie.genre === genreName);

  if (genreMovies.length === 0) {
    res.status(400).send("This genre doesn't exist!");
  } else {
    res.status(200).json(genreMovies);
  }
});

// Get get movie by director
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const directorMovies = movies.find((movie) => movie.director.name === directorName);

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("No such Director in Database");
  }
});



// app.listen console.log
app.listen(8080, () => {
  console.log("Your app is listening on Port 8080.");
});
