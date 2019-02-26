// stuff for testing basic routing
const request = require('supertest');
const { app } = require('./../index.js');

// stuff for testing database
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const User = require('./../models/user.js');
const { users, populateUsers , admin, populateAdmins} = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateAdmins);

describe("POST auth/signup", () => {
  it("should save a new user and respond with 200 and the user", (done) => {
    request(app)
      .post("auth/signup")
      .send({ studentid: "test2@gmail.com", name: "David", password: "sdgasgage", department: "Trade" })
      .expect(200)
      .expect((res) => {
        expect(res.body.studentid).toBe("test2@gmail.com");
        expect(res.body.name).toBe("David");
      })
      .end(done)
  })
});

describe("POST auth/signin", () => {
  it("should signin an existing user and respond with 200 and a token", (done) => {
    request(app)
      .post("auth/signin")
      .send(JSON.stringify({ email: "david@ens-lyon.fr", password: "password" }))
      .expect(200)
      .expect((res) => {
        expect(res.body["token"]).toBeTruthy();
      })
      .end(done)
  });

  it("should send 'Unauthorized' if user details not valid", (done) => {
    request(app)
      .post("/signin")
      .send(JSON.stringify({ email: "david@ens-lyon.fr", password: "pd" }))
      .expect((res) => {
        expect(res.text).toContain("Unauthorized")
      })
      .end(done)
  });
});
