const chai = require("chai");
const app = require("../app");
const chaiHttp = require("chai-http");
const User = require("../models/employee");
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const expect = chai.expect;
chai.use(chaiHttp);

let mockUser = {
  id: "mockid",
  firstname: "mockfirstname",
  email: "mock@gmail.com",
  password: "mockpassword",
  orgId: "mockorgid",
  departmentId: "mockdepartmentid",
  dateOfJoining: new Date(),
};

let mockUser2 = new User({
  firstname: "mockfirstname",
  email: "mockgmail.com",
  password: "mockpassword",
  orgId: "mockorgid",
  departmentId: "mockdepartmentid",
  dateOfJoining: new Date(),
  gender : "Male"
})

describe("User Login Route", () => {
  let compareStub;

  beforeEach(() => {
    compareStub = sinon.stub(bcrypt, "compare");
  });
  afterEach(() => {
    sinon.restore();
  });
  it("should login as user and return a token", (done) => {
    const userModelMock = {
      findOne: () => Promise.resolve(mockUser),
    };
    Object.assign(User, userModelMock);
    compareStub.resolves(true);

    chai
      .request(app)
      .post("/user/login")
      .send({
        email: "mock@gmail.com",
        password: "mockpassword",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        done();
      });
  });
  it("should not login as user as user does not exist", (done) => {
    const userModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/user/login")
      .send({
        email: "mock@gmail.com",
        password: "mockpassword",
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it("should not login as user as password is incorrect", (done) => {
    const userModelMock = {
      findOne: () => Promise.resolve(mockUser),
    };
    Object.assign(User, userModelMock);
    compareStub.resolves(false);

    chai
      .request(app)
      .post("/user/login")
      .send({
        email: "mock@gmail.com",
        password: "mockpassword",
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it("should give 500 when something unusual happens", (done) => {
    const userModelMock = {
      findOne: () => Promise.reject({}),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/user/login")
      .send({
        email: "mock@gmail.com",
        password: "mockpassword",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should give 422 when email is not valid", (done) => {
    chai
      .request(app)
      .post("/user/login")
      .send({
        email: "mockgmail.com",
        password: "mockpassword",
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        done();
      });
  });
  it("should give 500 when there is error in jwt sign", (done) => {
    const userModelMock = {
      findOne: () => Promise.resolve(mockUser),
    };
    Object.assign(User, userModelMock);
    compareStub.resolves(true);
    sinon.stub(jwt, "sign").throws();
    chai
      .request(app)
      .post("/user/login")
      .send({
        email: "mockemail@gmail.com",
        password: "mockpassword",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should give unauthorized if user has left the organization", (done) => {
    const userModelMock = {
      findOne: () =>
        Promise.resolve({ ...mockUser, dateOfLeaving: new Date() }),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/user/login")
      .send({
        email: "mock@gmail.com",
        password: "mockpassword",
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});

describe("User Logout Route", () => {
  it("should logout user", (done) => {
    chai
      .request(app)
      .post("/user/logout")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("Get User Data Route", () => {
  let jwtStub;
  beforeEach(() => {
    jwtStub = sinon.stub(jwt, "verify");
    jwtStub.callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = { role: "User" };
      callback(null, decodedToken);
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should get user data", (done) => {
    const userModelMock = {
      findById: () => Promise.resolve(mockUser),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .get("/user/get/mockid")
      .set("Authorization","Bearer mocktoken")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("user");
        done();
      });
  });
  it("should not get user data as user not found", (done) => { 
    const userModelMock = {
      findById: () => Promise.resolve(null),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .get("/user/get/mockid")
      .set("Authorization","Bearer mocktoken")
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  })
  it("should give 500 when something unusual happens", (done) => {
    const userModelMock = {
      findById: () => Promise.reject({}),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .get("/user/get/mockid")
      .set("Authorization","Bearer mocktoken")
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe("User Update Profile Route", () => {
  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = { role: "User" };
      callback(null, decodedToken);
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should update profile", (done) => {
    const userModelMock = {
      findById: () => Promise.resolve(mockUser2),
      // save : ()=> Promise.resolve()
    };
    Object.assign(User, userModelMock);
    sinon.stub(User.prototype, "save").resolves(mockUser2);
    chai
      .request(app)
      .post("/user/updateProfile")
      .set("Authorization", "Bearer mocktoken")
      .send({
        userId: "mockid",
        datatoUpdate: { firstname: "newfirstname", gender: "Female" },
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Profile updated");
        done();
      });
  
  })
  it("should not update profile as user not found", (done) => {
    const userModelMock = {
      findById: () => Promise.resolve(null),
      // save : ()=> Promise.resolve()
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/user/updateProfile")
      .set("Authorization", "Bearer mocktoken")
      .send({
        userId: "mockid",
        dataToUpdate: { firstname: "newfirstname" },
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  })
  it("should give 500 when something unusual happens", (done) => {
    const userModelMock = {
      findById: () => Promise.reject({}),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/user/updateProfile")
      .set("Authorization", "Bearer mocktoken")
      .send({
        userId: "mockid",
        dataToUpdate: { firstname: "newfirstname" },
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should give 500 when unable to save", (done) => { 
    const userModelMock = {
      findById: () => Promise.resolve(mockUser2),
    };
    Object.assign(User, userModelMock);
    sinon.stub(User.prototype, "save").rejects();
    chai
      .request(app)
      .post("/user/updateProfile")
      .set("Authorization", "Bearer mocktoken")
      .send({
        userId: "mockid",
        dataToUpdate: { firstname: "newfirstname" },
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  })
});


describe("User Update Password Route", () => {
  let compareStub;
  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = { role: "User" };
      callback(null, decodedToken);
    });
    compareStub = sinon.stub(bcrypt, "compare");
  });

  afterEach(() => {
    sinon.restore();
  });
  it("should update password", (done) => {
    
    const userModelMock = {
      findById: () => Promise.resolve(mockUser2),
    };
    Object.assign(User, userModelMock);
    compareStub.resolves(true);
    sinon.stub(User.prototype, "save").resolves(mockUser2);
    chai
      .request(app)
      .post("/user/updatePassword")
      .set("Authorization","Bearer mocktoken")
      .send({
        userId: "mockid",
        oldPassword: "mockpassword",
        newPassword: "newpassword",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Password updated");
        done();
      });
  });
  it("should not update password as user not found", (done) => {
    const userModelMock = {
      findById: () => Promise.resolve(null),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/user/updatePassword")
      .set("Authorization","Bearer mocktoken")
      .send({
        userId: "mockid",
        oldPassword: "mockpassword",
        newPassword: "newpassword",
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it("should not update password as password is incorrect", (done) => {
    const userModelMock = {
      findById: () => Promise.resolve(mockUser2),
    };
    Object.assign(User, userModelMock);
    compareStub.resolves(false);
    chai
      .request(app)
      .post("/user/updatePassword")
      .set("Authorization","Bearer mocktoken")
      .send({
        userId: "mockid",
        oldPassword: "mockpassword",
        newPassword: "newpassword",
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it("should give 500 when something unusual happens", (done) => {
    const userModelMock = {
      findById: () => Promise.reject({}),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/user/updatePassword")
      .set("Authorization","Bearer mocktoken")
      .send({
        userId: "mockid",
        oldPassword: "mockpassword",
        newPassword: "newpassword",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should give 500 when unable to save", (done) => {
    const userModelMock = {
      findById: () => Promise.resolve(mockUser2),
    };
    Object.assign(User, userModelMock);
    compareStub.resolves(true);
    sinon.stub(User.prototype, "save").rejects();
    chai
      .request(app)
      .post("/user/updatePassword")
      .set("Authorization","Bearer mocktoken")
      .send({
        userId: "mockid",
        oldPassword: "mockpassword",
        newPassword: "newpassword",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});



