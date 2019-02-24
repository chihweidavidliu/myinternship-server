const passport = require("passport");
const User = require("../models/user");
const Admin = require("../models/admin");
const LocalStrategy = require("passport-local");

function SessionConstructor(userId, userGroup, details) {
  this.userId = userId;
  this.userGroup = userGroup;
  this.details = details;
}

// serializeUser creates some unique identifying piece of information about a user (like a jwt token does) and lets us put it in a cookie
passport.serializeUser((user, done) => {
  const userPrototype = Object.getPrototypeOf(user);

  let userGroup;
  if (userPrototype === User.prototype) {
    userGroup = "user";
  } else if (userPrototype === Admin.prototype) {
    userGroup = "admin";
  }
  const sessionConstructor = new SessionConstructor(user.id, userGroup, "");
  done(null, sessionConstructor);
});

// deserializeUser decodes cookies to give us the id of the user which we can then use to grab the user's details from the db
passport.deserializeUser(async (sessionConstructor, done) => {
  try {
    if (sessionConstructor.userGroup == "user") {
      const existingUser = await User.findById(sessionConstructor.userId);
      done(null, existingUser);
    } else if (sessionConstructor.userGroup == "admin") {
      const existingAdmin = await Admin.findById(sessionConstructor.userId);
      done(null, existingAdmin);
    }
  } catch (err) {
    done(err, false);
  }
});

// create local strategy
const studentOptions = {
  usernameField: "studentid" // tell local strategy to use email value as the 'username' instead of 'username' - password is handled automatically
};

const studentLocalLogin = new LocalStrategy(studentOptions, (studentid, password, done) => {
  // verify username and password, call done with user if validated
  User.findByCredentials(studentid, password, done) // pass done to the User method for error handling
    .then((user) => done(null, user)) // if a user is returned, tell passport to continue to next step of the route, passing on the user
    .catch((err) => done(err, false)); // return error and false if search failed to occur
});

// tell passport to use this strategy
passport.use("student-local", studentLocalLogin);

const adminOptions = {
  usernameField: "username"
};
const adminLocalLogin = new LocalStrategy(adminOptions, async (username, password, done) => {
  Admin.findByCredentials(username, password)
    .then((user) => done(null, user))
    .catch((err) => done(err, false));
});

passport.use("admin-local", adminLocalLogin);
