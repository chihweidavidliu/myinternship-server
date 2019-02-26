const {ObjectID} = require('mongodb');
const {User} = require('./../../models/user.js');
// const {Admin} = require('./../../models/admin.js');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const adminId = new ObjectID();

const users = [{
  _id: userOneId,
  studentid: "12345",
  name: "Chih-Wei",
  password: 'password',
  department: 'Languages',
  choices: ["Google", "Facebook", "Twitter"],

}, {
  _id: userTwoId,
  studentid: "54321",
  name: "Jen",
  password: 'password',
  department: 'Law',
  choices: []
}]


const admin = {
  _id: adminId,
  username: "admin",
  password: "1521993",
  companyChoices: { Apple: ["Jen", "Chih-Wei"] },
  allowStudentSignup: true,
  auth: "admin"
}

const populateUsers = (done) => {
  User.deleteMany({}).then(() => {
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]).then(() => {
      done();
    })
  })
}

const populateAdmins = (done) => {
  Admin.deleteMany({}).then(() => {
    let admin = new Admin(admins).save();
  }).then(() => {
    done();
  })
}

module.exports = {
  users: users,
  populateUsers: populateUsers,
  populateAdmins: populateAdmins,
  admin: admin,
}
