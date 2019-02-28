// stuff for testing basic routing
const request = require("supertest");
const { app } = require("./../index.js");
const agent = request.agent(app); // set up agent for session testing

// stuff for testing database
const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");
const User = require("../models/user.js");
const Admin = require("../models/admin.js");
const { users, populateUsers, admins, populateAdmins } = require("./seed/seed.js");

beforeEach(populateUsers);
beforeEach(populateAdmins);

describe("POST auth/signup", () => {
  it("should save a new user and respond with 200 and the user", (done) => {
    request(app)
      .post("/auth/signup")
      .send({ studentid: "123456", name: "David", password: "sdgasgage", department: "Trade" })
      .expect(200)
      .expect((res) => {
        expect(res.body.studentid).toBe("123456");
        expect(res.body.name).toBe("David");
        expect(res.body.password).toBeFalsy(); // should be no password sent
        expect(res.body.department).toBe("Trade");
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }

        User.findOne({ _id: res.body._id })
          .then((user) => {
            expect(user.studentid).toBe("123456");
            expect(user.name).toBe("David");
            expect(user.department).toBe("Trade");
            done();
          })
          .catch((err) => done(err));
      });
  });
});

describe("POST auth/signin", () => {
  it("should signin an existing user and respond with 200 and the user", (done) => {
    agent
      .post("/auth/signin")
      .send({ studentid: "12345", password: "password"})
      .expect(200)
      .expect((res) => {
        expect(res.body.studentid).toBe("12345");
        expect(res.body.name).toBe("Chih-Wei");
        expect(res.body.department).toBe("Languages");
        expect(res.body.choices).toEqual(["Google", "Facebook", "Twitter"]);
      })
      .end(done);
  });

  it("should send 'Unauthorized' if user details not valid", (done) => {
    request(app)
      .post("/auth/signin")
      .send({ studentid: "12345", password: "p"})
      .expect((res) => {
        expect(res.text).toContain("Unauthorized");
      })
      .end(done);
  });
});

describe("GET /api/current_user", () => {
  it("should return current user when logged in", (done) => {
    agent
      .get("/api/current_user")
      .expect(200)
      .end(done);
  });

  it("should return unauthorized when user logged out", (done) => {
    request(app)
      .get("/api/current_user")
      .expect(401)
      .end(done);
  });
});


describe("GET /api/logout", () => {
  it("should log user out", (done) => {
    agent
      .get("/auth/logout")
      .expect(302)
      .end(done);
  });
});


// ADMIN ROUTES
// describe("POST /auth/admin/signin", () => {
//   it("should sign in admin", (done) => {
//     request(app)
//       .post("/auth/admin/signin")
//       .send({ username: "admin", password: "1521993"})
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.username).toBe("admin");
//       })
//       .end(done)
//   })
// })
