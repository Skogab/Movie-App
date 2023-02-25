

const jwtSecret = 'your_jwt_secret'; // Dies muss derselbe Schlüssel sein, wie in der JWTStrategy

const jwt = require('jsonwebtoken'), // Importiert JTW und passport Module
  passport = require('passport');

require('./passport'); // Meine lokale passport Datei


let generateJWTToken = (user) => { // Die Funktion "generateJWTToken" erstellt einen JWT für einen gegebenen user.
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // Dies ist der Benutzername, den ich im JWT verschlüssele
    expiresIn: '7d', // Laufzeit des Token, hier 7 Tage
    algorithm: 'HS256' // Dies ist der Algorithmus, der genutzt wird, um die Werte des JWT zu "signieren" oder zu verschlüsseln
  });
}


/* POST login. */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}