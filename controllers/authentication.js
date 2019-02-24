const User = require("../models/user");
const Admin = require("../models/admin");

exports.studentSignup = async (req, res, next) => {
  console.log(req.body);
  const studentid = req.body.studentid;
  const password = req.body.password;
  const name = req.body.name;
  const department = req.body.department;

  const existingUser = await User.findOne({ studentid: studentid });

  if (existingUser) {
    return res.status(400).send({ message: "studentid is in use" });
  }

  const newUser = await new User({
    studentid: studentid,
    password: password,
    department: department,
    name: name
  }).save();

  req.login(newUser, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};

exports.adminSignup = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  const admins = await Admin.find({});
  if(admins.length > 0) {
    res.status(400).send("There is already an admininistrative account set");
  }

  const newAdmin = await new Admin({
    username: username,
    password: password
  }).save();

  req.login(newAdmin, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};
