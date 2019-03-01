const Admin = require("../models/admin");

module.exports.updateCompanies = async (req, res, next) => {
  try {
    const updatedCompanies = req.body.companies;
    const updatedAdmin = await Admin.findOneAndUpdate(
      {
        _id: req.user._id
      },
      { $set: { companyChoices: updatedCompanies } },
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
