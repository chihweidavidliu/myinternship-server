const Authentication = require("./controllers/authentication");
const AdminActions = require("./controllers/adminActions");
const StudentActions = require("./controllers/studentActions");
const passportService = require("./services/passport");
const passport = require("passport");

// setup auth middleware with passport - tell it to use the jwt strategy and tell it not to create a cookie-based session
const requireStudentLogin = passport.authenticate("student-local");
const requireAdminLogin = passport.authenticate("admin-local");
const requireStudentAuth = require("./middleware/requireStudentAuth");
const requireAdminAuth = require("./middleware/requireAdminAuth");

module.exports = function(app) {
  // student auth
  app.post("/auth/signup", Authentication.studentSignup, Authentication.sendWelcomeEmail);

  app.post("/auth/signin", requireStudentLogin, (req, res, next) => {
    res.send(req.user);
  });

  // student api routes
  app.get("/api/current_user", requireStudentAuth, (req, res) => {
    res.send(req.user);
  });
  app.get("/api/signupAuth", StudentActions.getSignupAuthState);
  app.get("/api/companies", requireStudentAuth, StudentActions.getCompanies);
  app.patch("/api/updateStudent", requireStudentAuth, StudentActions.updateStudent);

  // admin auth routes
  app.post("/auth/admin/signup", Authentication.adminSignup, (req, res, next) => {
    res.send(req.user);
  });
  app.post("/auth/admin/signin", requireAdminLogin, (req, res, next) => {
    res.send(req.user);
  });
  // admin api routes
  app.patch("/api/updateAdmin", requireAdminAuth, AdminActions.updateAdmin);
  app.get("/api/current_admin", requireAdminAuth, (req, res) => {
    res.send(req.user);
  });
  app.get("/api/studentChoices", requireAdminAuth, AdminActions.getStudentChoices);
  app.get("/api/numberOfAdmins", AdminActions.checkNumberOfAdmins);

  app.delete("/api/all", requireAdminAuth, AdminActions.deleteAll);

  // logout route for all users
  app.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};
