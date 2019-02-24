const User = require("../models/user");

exports.signup = async (req, res, next) => {
  console.log(req.body);
  const studentid = req.body.studentid;
  const password = req.body.password;
  const name = req.body.name;
  const department = req.body.department;

  const existingUser = await User.findOne({ studentid: studentid })

  if(existingUser) {
    return res.status(400).send({ message: "studentid is in use" });
  }

  const newUser = await new User({
    studentid: studentid,
    password: password,
    department: department,
    name: name
  }).save();

  req.login(newUser, function(err) {
    if (err) { return next(err); }
    next();
  });
};
