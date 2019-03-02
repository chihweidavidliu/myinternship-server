const _ = require("lodash");
const Admin = require("../models/admin");


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
