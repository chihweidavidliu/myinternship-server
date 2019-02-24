const Authentication = require("./controllers/authentication");
const passportService = require("./services/passport");
const passport = require("passport");

// setup auth middleware with passport - tell it to use the jwt strategy and tell it not to create a cookie-based session
const requireLocalSignin = passport.authenticate("local");
const requireLogin = require("./middleware/requireLogin");

module.exports = function(app) {
  app.get("/", (req, res, next) => {
    res.send("Hi there");
  });
  app.post("/signup", Authentication.signup, (req, res, next) => {
    res.send(req.user);
  });

  app.post("/signin", requireLocalSignin, (req, res, next) => {
    res.send(req.user);
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/current_user", requireLogin, (req, res) => {
    res.send(req.user);
  })
};
