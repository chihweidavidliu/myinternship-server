const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

// Admin schema

let AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true // stops email duplicates occuring in the database
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  companyChoices: [],
  allowStudentSignup: {
    type: Boolean,
    default: true
  },
  allowStudentChoices: {
    type: Boolean,
    default: false
  },
  auth: {
    type: String,
    default: "admin"
  }
});

AdminSchema.statics.findByCredentials = function(username, password) {
  let Admin = this;
  return Admin.findOne({
    username: username
  }).then((admin) => {
    if (!admin) {
      console.log("Can't find admin");
      return Promise.reject(); // this will trigger catch case in server.js
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, admin.password, (err, res) => {
        if (res == true) {
          resolve(admin);
        } else {
          reject();
        }
      });
    });
  });
};

AdminSchema.methods.toJSON = function() {
  // redefine toJSON method used when using send() to leave off sensitive information
  let admin = this;
  let adminObject = admin.toObject();

  return _.pick(adminObject, ["_id", "username", "companyChoices", "allowStudentSignup", "allowStudentChoices", "auth"]);
};

AdminSchema.pre("save", function(next) {
  // this will hash all passwords every time a password is set or modified
  const admin = this;

  if (admin.isModified("password")) {
    // generate a salt
    bcrypt.genSalt(10, (err, salt) => {
      //genSalt(number of rounds of encryption, callback with err and salt parameters)
      // hash the password with the salt
      bcrypt.hash(admin.password, salt, (err, hash) => {
        //hash takes 3 arguments, thing to be hashed, the salt to be used and a callback
        // set the admin password as the hash
        admin.password = hash;
        // need to call next for middleware to move on
        next();
      });
    });
  } else {
    // if password has not been modified, just move on
    next();
  }
});

// Admin models
let Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
