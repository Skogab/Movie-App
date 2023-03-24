

const bcrypt = require('bcrypt');

const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});
  
let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });




 userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};
// don't use arrow functions when defining methods. Eg. of Instance method that can be called on each object/document created (each individual object/document)
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

  
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);
  
  module.exports.Movie = Movie;
  module.exports.User = User;