const _ = require("lodash");
const Admin = require("../models/admin");
const User = require("../models/user");

module.exports.updateAdmin = async (req, res, next) => {
  try {
    const body = _.pick(req.body, ["companyChoices", "allowStudentSignup", "allowStudentChoices"]);

    const updatedAdmin = await Admin.findOneAndUpdate(
      {
        _id: req.user._id
      },
      { $set: body },
      { new: true }
    );

    if (!updatedAdmin) {
      res.status(404).send();
      return next();
    }
    res.send(updatedAdmin);
    next();
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports.checkNumberOfAdmins = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({});
    if (admin) {
      res.send("1");
    } else {
      res.send("0");
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports.getStudentChoices = async (req, res, next) => {
  try {
    const students = await User.find({});
    // remove password
    const mapped = students.map((student) => {
      return {
        studentid: student.studentid,
        name: student.name,
        department: student.department,
        choices: student.choices
      };
    });

    res.send({ students: mapped });
  } catch (err) {
    res.status(400).send(err);
  }
};
