const Admin = require("../models/admin");

module.exports.getCompanies = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({});
    const companies = Object.keys(admin.companyChoices);
    res.send({ companies: companies });
  } catch (err) {
    res.status(400).send(err);
  }
};
