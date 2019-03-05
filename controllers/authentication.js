const User = require("../models/user");
const Admin = require("../models/admin");

const nodemailer = require("nodemailer");

exports.sendWelcomeEmail = (req, res, next) => {
  // don't send email when testing
  if (process.env.NODE_ENV === "test") {
    return next();
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "chihweiliu1993@gmail.com",
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: "chihweiliu1993@gmail.com",
    to: "chihweiliu1993@gmail.com",
    subject: "Your Myinternship sign-in credentials",
    html: `Dear ${req.body["name"]},
    <p>Thank you for signing up to Myinternship.<br>
    Here are your sign-in credentials. Please keep them safe.<br>
    <p>Your <strong>studentid</strong> is ${req.body["studentid"]}<br>
    Your <strong>password</strong> is ${req.body["password"]}<br></p></p>
      <br>
      From the Myinternship Team`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      next(errors);
    } else {
      console.log("Email sent: " + info.response);
      next();
    }
  });
};

exports.studentSignup = async (req, res, next) => {
  const institutionCode = req.body.institutionCode;
  const studentid = req.body.studentid;
  const password = req.body.password;
  const name = req.body.name;
  const department = req.body.department;

  if(institutionCode !== process.env.INSTITUTION_CODE) {
    return res.status(404).send({ message: "incorrect institution code" });
  }

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
    // send user
    res.send(req.user);
    next();
  });
};

exports.adminSignup = async (req, res, next) => {
  const adminSecret = req.body.adminSecret;
  const username = req.body.username;
  const password = req.body.password;

  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(404).send({ message: "incorrect adminSecret" });
  }

  let allowStudentChoices;
  if (req.body.allowStudentChoices) {
    allowStudentChoices = req.body.allowStudentChoices;
  } else {
    allowStudentChoices = false;
  }

  let companyChoices;
  if (req.body.companyChoices) {
    companyChoices = req.body.companyChoices;
  } else {
    companyChoices = [];
  }

  const admins = await Admin.find({});
  if (admins.length > 0) {
    return res.status(400).send({ message: "admin already exists" });
  }

  const newAdmin = await new Admin({
    username: username,
    password: password,
    allowStudentChoices: allowStudentChoices,
    companyChoices: companyChoices
  }).save();

  req.login(newAdmin, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};
