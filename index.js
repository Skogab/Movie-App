// Erforderliche Module importieren
const mongoose = require("mongoose");
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;
require("dotenv").config();

// HEROKU
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("strictQuery", false);

const { check, validationResult } = require("express-validator");

const fs = require("fs");
const path = require("path");

const express = require("express");
(app = express()), (morgan = require("morgan")), (bodyParser = require("body-parser")), (uuid = require("uuid"));

const passport = require("passport");
require("./passport");
app.use(express.static("public"));
app.use(morgan("common"));
app.use(morgan("dev"));
const cors = require("cors");

let allowedOrigins = [
	"https://movieappskogaby.herokuapp.com",
	"http://localhost:1234",
	"http://localhost:8080",
	"http://localhost:4200",
];

// CORS-Middleware
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				// Wenn ein bestimmter Ursprung nicht in der Liste der erlaubten Ursprünge gefunden wird
				let message = "The CORS policy for this application doesnt allow access from origin" + origin;
				return callback(new Error(message), false);
			}
			return callback(null, true);
		},
	})
);

// Body-Parser-Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Authentifizierungsmiddleware importieren und einrichten
let auth = require("./auth")(app);

/**
 * @route GET /
 * @group Allgemein - Allgemeine Endpunkte
 * @returns {string} 200 - Willkommensnachricht mit einem Link zur Dokumentation
 */
app.get("/", (req, res) => {
	res.send(
		"Hello and welcome to my My Movie App! <br><br> Click <a href='/documentation.html'>here</a> for documentation."
	);
});

/**
 * @route GET /movies
 * @group Filme - Operationen im Zusammenhang mit Filmen
 * @returns {Array<Object>} 200 - Ein Array von Filmobjekten
 * @returns {Error} 500 - Eine Fehlermeldung
 * @security JWT
 */
app.get("/movies", passport.authenticate("jwt", { session: false }), (req, res) => {
	Movies.find()
		.then((movies) => {
			res.status(200).json(movies);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error: " + err);
		});
});

/**
 * @route GET /movies/:title
 * @group Filme - Operationen im Zusammenhang mit Filmen
 * @param {string} title.path.required - Der Titel des Films
 * @returns {Object} 200 - Das Filmobjekt mit dem angegebenen Titel
 * @returns {Error} 500 - Eine Fehlermeldung
 * @security JWT
 */
app.get("/movies/:title", passport.authenticate("jwt", { session: false }), (req, res) => {
	Movies.findOne({
		Title: req.params.title,
	})
		.then((movie) => {
			res.status(200).json(movie);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error: " + err);
		});
});

/**
 * @route GET /movies/genre/:genre
 * @group Filme - Operationen im Zusammenhang mit Filmen
 * @param {string} genre.path.required - Das Genre der abzurufenden Filme
 * @returns {Array<Object>} 200 - Ein Array von Filmobjekten mit dem angegebenen Genre
 * @returns {Error} 500 - Eine Fehlermeldung
 * @security JWT
 */
app.get("/movies/genre/:genre", passport.authenticate("jwt", { session: false }), (req, res) => {
	const genre = req.params.genre;
	Movies.find({ "Genre.Name": genre })
		.then((movies) => {
			res.status(200).json(movies);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error: " + err);
		});
});

/**
 * @route GET /movies/director/:director
 * @group Filme - Operationen im Zusammenhang mit Filmen
 * @param {string} director.path.required - Der Name des Regisseurs
 * @returns {Array<Object>} 200 - Ein Array von Filmobjekten, die von dem angegebenen Regisseur gedreht wurden
 * @returns {Error} 500 - Eine Fehlermeldung
 * @security JWT
 */
app.get("/movies/director/:director", passport.authenticate("jwt", { session: false }), (req, res) => {
	const director = req.params.director;
	Movies.find({ "Director.Name": director })
		.then((movies) => {
			res.status(200).json(movies);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Fehler: " + err);
		});
});

/**
 * @route GET /users
 * @group Benutzer - Operationen im Zusammenhang mit Benutzern
 * @returns {Array<Object>} 201 - Ein Array von Benutzerobjekten
 * @returns {Error} 500 - Eine Fehlermeldung
 * @security JWT
 */
app.get("/users", passport.authenticate("jwt", { session: false }), (req, res) => {
	Users.find()
		.then((users) => {
			res.status(201).json(users);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Fehler: " + err);
		});
});

/**
 * @route GET /users/:Username
 * @group Benutzer - Operationen im Zusammenhang mit Benutzern
 * @param {string} Username.path.required - Der Benutzername des Benutzers
 * @returns {Object} 200 - Das Benutzerobjekt mit dem angegebenen Benutzernamen
 * @returns {Error} 500 - Eine Fehlermeldung
 * @security JWT
 */
app.get("/users/:Username", passport.authenticate("jwt", { session: false }), (req, res) => {
	Users.findOne({ Username: req.params.Username })
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Fehler: " + err);
		});
});

/**
 * @route GET /profiles/:Username
 * @group Benutzer - Operationen im Zusammenhang mit Benutzern
 * @param {string} Username.path.required - Der Benutzername des Benutzers
 * @returns {Object} 200 - Das Benutzerobjekt mit dem angegebenen Benutzernamen
 * @returns {Error} 500 - Eine Fehlermeldung
 * @security JWT
 */
app.get("/profiles/:Username", passport.authenticate("jwt", { session: false }), (req, res) => {
	Users.findOne({ Username: req.params.Username })
		.then((user) => {
			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}
			res.status(200).json(user);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Fehler: " + err);
		});
});

/**
 * @route POST /users
 * @group Benutzer - Operationen im Zusammenhang mit Benutzern
 * @param {string} Username.body.required - Der Benutzername des neuen Benutzers
 * @param {string} Password.body.required - Das Passwort des neuen Benutzers
 * @param {string} Email.body.required - Die E-Mail-Adresse des neuen Benutzers
 * @param {string} Birthday.body - Das Geburtsdatum des neuen Benutzers
 * @returns {Object} 201 - Das neu erstellte Benutzerobjekt
 * @returns {Object} 422 - Validierungsfehler
 */
app.post(
	"/users",
	[
		check("Username", "BUsername is required").isLength({ min: 5 }),
		check("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
		check("Password", "Password is required").not().isEmpty(),
		check("Email", "Email does not appear to be valid").isEmail(),
	],
	(req, res) => {
		// Validierungsergebnisse überprüfen
		let errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		let hashedPassword = Users.hashPassword(req.body.Password);
		Users.findOne({ Username: req.body.Username }) // Überprüfen, ob bereits ein Benutzer mit dem angeforderten Benutzernamen vorhanden ist
			.then((user) => {
				if (user) {
					// Wenn der Benutzer gefunden wurde, eine Antwort senden, dass er bereits existiert
					return res.status(400).send(req.body.Username + " already exists");
				} else {
					Users.create({
						Username: req.body.Username,
						Password: hashedPassword,
						Email: req.body.Email,
						Birthday: req.body.Birthday,
					})
						.then((user) => {
							res.status(201).json(user);
						})
						.catch((error) => {
							console.error(error);
							res.status(500).send("Error: " + error);
						});
				}
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send("Error: " + error);
			});
	}
);

/**
 * @route PUT /users/:Username
 * @group Benutzer - Operationen im Zusammenhang mit Benutzern
 * @param {string} Username.path.required - Der Benutzername des zu aktualisierenden Benutzers
 * @param {string} Username.body.required - Der aktualisierte Benutzername
 * @param {string} Password.body.required - Das aktualisierte Passwort
 * @param {string} Email.body.required - Die aktualisierte E-Mail-Adresse
 * @param {string} Birthday.body - Das aktualisierte Geburtsdatum
 * @returns {Object} 200 - Das aktualisierte Benutzerobjekt
 * @returns {Object} 422 - Validierungsfehler
 */
app.put(
	"/users/:Username",
	[
		check("Username", "Username is required").isLength({ min: 5 }),
		check("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
		check("Password", "Password is required").not().isEmpty(),
		check("Email", "Email does not appear to be valid").isEmail(),
	],
	(req, res) => {
		// Validierungsergebnisse überprüfen
		let errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		let hashedPassword = Users.hashPassword(req.body.Password);

		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$set: {
					Username: req.body.Username,
					Password: hashedPassword,
					Email: req.body.Email,
					Birthday: req.body.Birthday,
				},
			},
			{ new: true }, // Diese Zeile stellt sicher, dass das aktualisierte Dokument zurückgegeben wird
			(err, updatedUser) => {
				if (err) {
					console.error(err);
					res.status(500).send("Error: " + err);
				} else {
					res.json(updatedUser);
				}
			}
		);
	}
);

/**
 * @route POST /users/:Username/movies/:MovieID
 * @group Benutzer - Operationen im Zusammenhang mit Benutzern
 * @param {string} Username.path.required - Der Benutzername des Benutzers, dem der Film hinzugefügt werden soll
 * @param {string} MovieID.path.required - Die ID des Films, der zu den Favoriten des Benutzers hinzugefügt werden soll
 * @returns {Object} 200 - Das aktualisierte Benutzerobjekt mit dem hinzugefügten Film in der Favoritenliste
 * @returns {Object} 422 - Validierungsfehler
 */
app.post(
	"/users/:Username/movies/:MovieID",
	[
		check("Username", "Username is required").isLength({ min: 5 }),
		check("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
		check("Password", "Password is required").not().isEmpty(),
		check("Email", "Email does not appear to be valid").isEmail(),
	],
	(req, res) => {
		// Validierungsergebnisse überprüfen
		let errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$push: { FavoriteMovies: req.params.MovieID },
			},
			{ new: true }, // Diese Zeile stellt sicher, dass das aktualisierte Dokument zurückgegeben wird
			(err, updatedUser) => {
				if (err) {
					console.error(err);
					res.status(500).send("Error: " + err);
				} else {
					res.json(updatedUser);
				}
			}
		);
	}
);

/**
 * @route DELETE /users/:Username
 * @group Benutzer - Operationen im Zusammenhang mit Benutzern
 * @param {string} Username.path.required - Der Benutzername des zu löschenden Benutzers
 * @returns {string} 200 - Eine Bestätigungsnachricht, dass der Benutzer gelöscht wurde
 * @returns {string} 400 - Eine Fehlermeldung, dass der Benutzer nicht gefunden wurde
 * @returns {Error} 500 - Eine Fehlermeldung
 * @security JWT
 */
app.delete("/users/:Username", passport.authenticate("jwt", { session: false }), (req, res) => {
	Users.findOneAndRemove({ Username: req.params.Username })
		.then((user) => {
			if (!user) {
				res.status(400).send(req.params.Username + " was not found");
			} else {
				res.status(200).send(req.params.Username + " was deleted.");
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error: " + err);
		});
});

/**
 * @route DELETE /users/:Username/movies/:MovieID
 * @group Benutzer - Operationen im Zusammenhang mit Benutzern
 * @param {string} Username.path.required - Der Benutzername des Benutzers, aus dessen Favoritenliste der Film entfernt werden soll
 * @param {string} MovieID.path.required - Die ID des Films, der aus der Favoritenliste des Benutzers entfernt werden soll
 * @returns {Object} 200 - Das aktualisierte Benutzerobjekt ohne den entfernten Film in der Favoritenliste
 * @returns {Object} 404 - Eine Fehlermeldung, dass der Benutzer nicht gefunden wurde oder der Film nicht in der Favoritenliste enthalten war
 * @returns {Object} 500 - Eine Fehlermeldung
 * @security JWT
 */
app.delete("/users/:Username/movies/:MovieID", passport.authenticate("jwt", { session: false }), async (req, res) => {
	try {
		// Den Benutzer mit dem angegebenen Benutzernamen finden und das FavoriteMovies-Array aktualisieren
		const updatedUser = await Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{ $pull: { FavoriteMovies: req.params.MovieID } },
			{ new: true }
		);

		// Wenn der Benutzer nicht gefunden wurde, eine 404 Not Found-Antwort senden
		if (!updatedUser) {
			return res.status(404).json({ error: "User not found" });
		}

		// Benutzer erfolgreich aktualisiert, das aktualisierte Benutzerobjekt als Antwort senden
		res.status(200).json(updatedUser);
	} catch (error) {
		// Fehler bei der Aktualisierungsoperation behandeln
		console.error(error);
		res.status(500).json({
			error: "Error removing movie from favorites",
			details: error.message,
		});
	}
});

// Server auf Port starten
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
	console.log("Listening on Port " + port);
});
