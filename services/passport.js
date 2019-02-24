const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local");

// serializeUser creates some unique identifying piece of information about a user (like a jwt token does) and lets us put it in a cookie
passport.serializeUser((user, done) => {
  done(null, user.id); // this is the mongodb id, not the google id (as some users might use facebook oauth etc.)
});

// deserializeUser decodes cookies to give us the id of the user which we can then use to grab the user's details from the db
passport.deserializeUser(async (id, done) => {
  try {
    const existingUser = await User.findById(id);
    done(null, existingUser);
  } catch (err) {
    done(err, false);
  }
});

// create local strategy
const localOptions = {
  usernameField: "studentid", // tell local strategy to use email value as the 'username' instead of 'username' - password is handled automatically
}

const localLogin = new LocalStrategy(localOptions, (studentid, password, done) => {
  // verify username and password, call done with user if validated
  User
    .findByCredentials(studentid, password, done) // pass done to the User method for error handling
    .then(user => done(null, user)) // if a user is returned, tell passport to continue to next step of the route, passing on the user
    .catch(err => done(err, false)) // return error and false if search failed to occur
});

// tell passport to use this strategy
passport.use(localLogin);
