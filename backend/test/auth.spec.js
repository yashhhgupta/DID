const User = require("../models/employee");
const Admin = require("../models/organization");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const jwt = require("jsonwebtoken");

const expect = chai.expect;

chai.use(chaiHttp);

describe("check_Authentication Middleware Admin", () => {
  it("Should return 403 if admin token is not provided", (done) => {
    chai
      .request(server)
      .get("/admin/get/:orgId")
      .end((err, res) => {
        expect(res).to.have.status(403);

        done();
      });
  });

  it("Should return 403 if admin token is invalid", (done) => {
    chai
      .request(server)
      .get("/admin/get/:orgId")
      .set("Authorization", `Bearer`)
      .end((err, res) => {
        expect(res).to.have.status(403);

        done();
      });
  });

  it("Should return 401 if user is not an admin", (done) => {
    const adminToken = jwt.sign({ role: "nsnfjds" }, process.env.SECRET_KEY);
    chai
      .request(server)
      .get("/admin/get/:orgId")
      .set("Authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res).to.have.status(401);

        done();
      });
  });
  it("Should return 200 if user is an admin", (done) => {
    const adminToken = jwt.sign({ role: "Admin" }, process.env.SECRET_KEY);
    const adminModelMock = {
      findOne: () => Promise.resolve({}),
    };
    Object.assign(Admin, adminModelMock);
    chai
      .request(server)
      .get("/admin/get/:orgId")
      .set("Authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);

        done();
      });
  });
});

describe("check_Authentication Middleware User", () => {
  it("Should return 403 if user token is not provided", (done) => {
    chai
      .request(server)
      .get("/user/get/mockid")
      .end((err, res) => {
        expect(res).to.have.status(403);

        done();
      });
  });

  it("Should return 403 if user token is invalid", (done) => {
    chai
      .request(server)
      .get("/user/get/mockid")
      .set("Authorization", `Bearer`)
      .end((err, res) => {
        expect(res).to.have.status(403);

        done();
      });
  });

  it("Should return 401 if user is not an user", (done) => {
    const userToken = jwt.sign({ role: "nsnfjds" }, process.env.SECRET_KEY);
    chai
      .request(server)
      .get("/user/get/mockid")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(401);

        done();
      });
  });
  it("Should return 200 if user is an user", (done) => {
    const userToken = jwt.sign({ role: "User" }, process.env.SECRET_KEY);
    const userModelMock = {
      findById: () => Promise.resolve({}),
    };
    Object.assign(User, userModelMock);
    chai
      .request(server)
      .get("/user/get/mockid")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);

        done();
      });
  });
});
