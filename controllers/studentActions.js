const Admin = require("../models/admin");
const User = require("../models/user");
const _ = require("lodash");

module.exports.getCompanies = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({});
    if (admin.allowStudentChoices === false) {
      return res.status(400).send("choices disabled by admin");
    }
    const companies = Object.keys(admin.companyChoices);
    res.send({ companies: companies });
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports.updateStudent = async (req, res, next) => {
  const body = _.pick(req.body, ["name", "department", "choices"]);

  try {
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: req.user._id
      },
      { $set: body },
      { new: true }
    );

    res.send(updatedUser);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports.getSignupAuthState = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({});
    res.send(admin.allowStudentSignup);
  } catch (err) {
    res.status(400).send(err);
  }
};
