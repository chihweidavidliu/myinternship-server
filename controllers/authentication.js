const User = require("../models/user");
const Admin = require("../models/admin");

const nodemailer = require("nodemailer");

exports.sendWelcomeEmail = (req, res, next) => {
  // don't send email when testing
  if (process.env.NODE_ENV === "test") {
    return next();
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.MAILGUN_USERNAME,
      pass: process.env.MAILGUN_PASSWORD
    }
  });

  if (process.env.NODE_ENV === "production" && process.env.SEND_MAILS === "true") {
    process.env.EMAIL_TARGET = `s${req.body.studentid}@just.edu.tw`;
  } else if (process.env.NODE_ENV === "production" && process.env.SEND_MAILS === "false") {
    // if still playing about in production mode, SEND_MAILS set to false will merely email the admin
    process.env.EMAIL_TARGET = process.env.ADMIN_EMAIL;
  }

  const mailOptions = {
    from: process.env.MAILGUN_USERNAME,
    to: process.env.EMAIL_TARGET,
    subject: "您已完成學生實習報名", // myInternship sign-up details
    html: `${req.body["name"]},
    <p>您已完成學生實習報名。請於面談後，再上網選取志願。您填寫的資料如下。</p>
    <p>
      <strong>您的學號是: </strong>${req.body["studentid"]}<br>
      <strong>您的密碼是: </strong>${req.body["password"]}<br>
    </p>
    <p>＊＊＊本信件由系統自動產生，請勿回覆。＊＊＊</p>
    <p>From the Myinternship Team</p>`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return next(error);
    }
    console.log("Email sent: " + info.response);
    // send confirmation to Admin
    const mailOptions2 = {
      from: process.env.MAILGUN_USERNAME,
      to: process.env.ADMIN_EMAIL,
      subject: "MyInternship signup notification", // myInternship sign-up details
      html: `Dear admin,
          <p>${req.body["name"]} has just signed up to MyInternship and has received a confirmation email.</p>
          <p>
            <strong>Studentid: </strong>${req.body["studentid"]}<br>
            <strong>Password: </strong>${req.body["password"]}<br>
          </p>
          <p>From the Myinternship Team</p>`
    };

    transporter.sendMail(mailOptions2, function(error, info) {
      if (error) {
        return next(error);
      }
      console.log("Email sent: " + info.response);
      next();
    });
  });
};

exports.studentSignup = async (req, res, next) => {
  const institutionCode = req.body.institutionCode;
  const studentid = req.body.studentid;
  const password = req.body.password;
  const name = req.body.name;
  const department = req.body.department;

  if (institutionCode !== process.env.INSTITUTION_CODE) {
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
