const chai = require("chai");
const app = require("../app");
const chaiHttp = require("chai-http");
const Admin = require("../models/organization");
const User = require("../models/employee");
const Department = require("../models/department");
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const expect = chai.expect;
chai.use(chaiHttp);

let mockAdmin = {
    id : "mockid",
  email: "mock@gmail.com",
  password: "mockpassword",
  name: "mockname",
  weightage: {
    gender: 10,
    sexualOrientation: 10,
    ethnicity: 10,
    disabilityStatus: 10,
    married: 10,
    parentalStatus: 10,
    religion: 10,
    geographicalLocation: 10,
    workExperience: 10,
    generationalDiversity: 10,
  },
  dataVisibility: {
    diversityScore: true,
    gender: true,
    sexualOrientation: true,
    ethnicity: true,
    disabilityStatus: true,
    married: true,
    parentalStatus: true,
    religion: true,
    geographicalLocation: true,
    workExperience: true,
    generationalDiversity: true,
  },
};
let mockAdmin2 = new Admin({
    id : "mockid",
  email: "mock@gmail.com",
  password: "mockpassword",
  name: "mockname",
  weightage: {
    gender: 10,
    sexualOrientation: 10,
    ethnicity: 10,
    disabilityStatus: 10,
    married: 10,
    parentalStatus: 10,
    religion: 10,
    geographicalLocation: 10,
    workExperience: 10,
    generationalDiversity: 10,
  },
  dataVisibility: {
    diversityScore: true,
    gender: true,
    sexualOrientation: true,
    ethnicity: true,
    disabilityStatus: true,
    married: true,
    parentalStatus: true,
    religion: true,
    geographicalLocation: true,
    workExperience: true,
    generationalDiversity: true,
  },
});
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
  gender: "Male",
});

describe("Admin Signup Route", () => {
  afterEach(() => {
    sinon.restore();
  });
  it("should signup as admin", (done) => {
    const adminModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(Admin, adminModelMock);
    sinon.stub(Admin.prototype, "save").resolves(mockAdmin);
    chai
      .request(app)
      .post("/admin/signup")
      .send({
        email: "mock@gmail.com",
        password: "mockpassword",
        name: "mockname",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal("Admin created successfully");
        done();
      });
  });
  it("should not signup as admin as user already exists", (done) => {
    const adminModelMock = {
      findOne: () => Promise.resolve(mockAdmin),
    };
    Object.assign(Admin, adminModelMock);
    chai
      .request(app)
      .post("/admin/signup")
      .send({
        email: "mock@gmail.com",
        password: "mockpassword",
        name: "mockname",
      })
      .end((err, res) => {
        expect(res).to.have.status(409);

        done();
      });
  });
  it("should give 500 while error in saving admin", (done) => {
    const adminModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(Admin, adminModelMock);
    sinon.stub(Admin.prototype, "save").rejects({});
    chai
      .request(app)
      .post("/admin/signup")
      .send({
        email: "mock@gmail.com",
        password: "mockpassword",
        name: "mockname",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should give 500 when something unusual happens", (done) => {
    const adminModelMock = {
      findOne: () => Promise.reject({}),
    };
    Object.assign(Admin, adminModelMock);
    chai
      .request(app)
      .post("/admin/signup")
      .send({
        email: "",
        password: "",
        name: "",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe("Admin Login Route", () => {
  let compareStub;

  beforeEach(() => {
    compareStub = sinon.stub(bcrypt, "compare");
  });
  afterEach(() => {
    sinon.restore();
  });
  it("should login as admin and return a token", (done) => {
    const adminModelMock = {
      findOne: () => Promise.resolve(mockAdmin),
    };
    Object.assign(Admin, adminModelMock);
    compareStub.resolves(true);

    chai
      .request(app)
      .post("/admin/login")
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
  it("should not login as admin as user does not exist", (done) => {
    const adminModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(Admin, adminModelMock);
    chai
      .request(app)
      .post("/admin/login")
      .send({
        email: "mock@gmail.com",
        password: "mockpassword",
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it("should not login as admin as password is incorrect", (done) => {
    const adminModelMock = {
      findOne: () => Promise.resolve(mockAdmin),
    };
    Object.assign(Admin, adminModelMock);
    compareStub.resolves(false);

    chai
      .request(app)
      .post("/admin/login")
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
    const adminModelMock = {
      findOne: () => Promise.reject({}),
    };
    Object.assign(Admin, adminModelMock);
    chai
      .request(app)
      .post("/admin/login")
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
      .post("/admin/login")
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
    const adminModelMock = {
      findOne: () => Promise.resolve(mockAdmin),
    };
    Object.assign(Admin, adminModelMock);
    compareStub.resolves(true);
    sinon.stub(jwt, "sign").throws();
    chai
      .request(app)
      .post("/admin/login")
      .send({
        email: "mockemail@gmail.com",
        password: "mockpassword",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe("Admin Logout Route", () => {
  it("should logout as admin", (done) => {
    chai
      .request(app)
      .post("/admin/logout")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Admin logged out");
        done();
      });
  });
});

describe("Admin Get Organization Route", () => { 
  let jwtStub;
  beforeEach(() => { 
    jwtStub = sinon.stub(jwt, "verify");
    jwtStub.callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = { role: "Admin" };
      callback(null, decodedToken);
    });
  });
  afterEach(() => {
    sinon.restore();
  });
  it("should get organization details", (done) => {
    const adminModelMock = {
      findOne: () => Promise.resolve(mockAdmin),
    };
    Object.assign(Admin, adminModelMock);
    chai
      .request(app)
      .get("/admin/get/mockid")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("org");
        done();
      });
  });
  it("should not get organization details as organization does not exist", (done) => {
    const adminModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(Admin, adminModelMock);
    chai
      .request(app)
      .get("/admin/get/mockid")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
   })
  it("should give 500 when something unusual happens", (done) => {
    const adminModelMock = {
      findOne: () => Promise.reject({}),
    };
    Object.assign(Admin, adminModelMock);
    chai
      .request(app)
      .get("/admin/get/mockid")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe("Admin Update Organization Route", () => {
  beforeEach(() => {
    sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = {
        role : "Admin"
      };
      callback(null, decodedToken);
    });
  });
  afterEach(() => {
    sinon.restore();
  });

  it("should update organization details", (done) => {
    const adminModelMock = {
      findById: () => Promise.resolve(mockAdmin2),
    };
    Object.assign(Admin, adminModelMock);
    sinon.stub(Admin.prototype, "save").resolves(mockAdmin2);
    chai
      .request(app)
      .post("/admin/updateProfile")
      .set("Authorization", "Bearer token")
      .send({
        orgId: "mockid",
        dataToUpdate: {
          name: "mockname",
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("org");
        expect(res.body.message).to.equal("Organization updated successfully");
        done();
      })
  });
  it("should not update organization details as organization does not exist", (done) => { 
    const adminModelMock = {
      findById: () => Promise.resolve(null),
    };
    Object.assign(Admin, adminModelMock);
    chai
      .request(app)
      .post("/admin/updateProfile")
      .set("Authorization", "Bearer token")
      .send({
        name: "mockname",
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  })
  it("should give 500 when something unusual happens", (done) => { 
    const adminModelMock = {
      findById: () => Promise.reject({}),
    };
    Object.assign(Admin, adminModelMock);
    chai
      .request(app)
      .post("/admin/updateProfile")
      .set("Authorization", "Bearer token")
      .send({
        name: "mockname",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  })
  it("should give 500 when failed to save", (done) => {
    const adminModelMock = {
      findById: () => Promise.resolve(mockAdmin2),
    };
    Object.assign(Admin, adminModelMock);
    sinon.stub(Admin.prototype, "save").rejects({});
    chai
      .request(app)
      .post("/admin/updateProfile")
      .set("Authorization", "Bearer token")
      .send({
        name: "mockname",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe("Admin add employee route", () => {
  beforeEach(() => {
    sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = {
        role : "Admin"
      };
      callback(null, decodedToken);
    });
  });
  afterEach(() => {
    sinon.restore();
  });

  it("should add employee", (done) => {
    const userModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(User, userModelMock);
    sinon.stub(User.prototype, "save").resolves(mockUser);
    chai
      .request(app)
      .post("/admin/add-employee")
      .set("Authorization", "Bearer token")
      .send({
        orgId: "mockid",
        employee: {
          email: "mockemail.com",
          firstname: "mockname",
          orgId: "mockid",
          departmentId: "mockdepartmentid",
        }
      }).
      end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal("Employee added successfully");
        done();
      });
  });
  it("should not add employee as employee already exists", (done) => {
    const userModelMock = {
      findOne: () => Promise.resolve(mockUser2),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/admin/add-employee")
      .set("Authorization", "Bearer token")
      .send({
        orgId: "mockid",
        employee: {
          email: "mockemail.com",
          firstname: "mockname",
          orgId: "mockid",
          departmentId: "mockdepartmentid",
        }
      }).
      end((err, res) => {
        expect(res).to.have.status(409);
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
      .post("/admin/add-employee")
      .set("Authorization", "Bearer token")
      .send({
        orgId: "mockid",
        employee: {
          email: "mockemail.com",
          firstname: "mockname",
          orgId: "mockid",
          departmentId: "mockdepartmentid",
        }
      }).
      end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should give 500 when failed to save", (done) => {
    const userModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(User, userModelMock);
    sinon.stub(User.prototype, "save").rejects({});
    chai
      .request(app)
      .post("/admin/add-employee")
      .set("Authorization", "Bearer token")
      .send({
        orgId: "mockid",
        employee: {
          email: "mockemail.com",
          firstname: "mockname",
          orgId: "mockid",
          departmentId: "mockdepartmentid",
        }
      }).
      end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  })
});

describe("Admin add multiple employees route", () => {
  beforeEach(() => {
    sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = {
        role : "Admin"
      };
      callback(null, decodedToken);
    });
  });
  afterEach(() => {
    sinon.restore();
  });
  it("should add mutiple employees", (done) => {
    const departmentModelMock = {
      find: () => Promise.resolve([{
        _id: "mockdepartmentid",
        name: "mockdepartmentname"}])
    }
    const userModelMock = {
      findOne: () => Promise.resolve(null),
      insertMany: () => Promise.resolve()
    };
    Object.assign(Department, departmentModelMock);
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/admin/add-employees")
      .set("Authorization", "Bearer token")
      .send({
        orgId: "mockid",
        employees: [
          {
            email: "mockemail.com",
            firstname: "mockname",
            orgId: "mockid",
            departmentId: "mockdepartmentid",
          },
          {
            email: "mockemail2.com",
            firstname: "mockname2",
            orgId: "mockid2",
            departmentId: "mockdepartmentid2",
            dateOfJoining: new Date("2021-09-01"),
            dateOfLeaving: new Date("2023-09-01"),
          },
        ],
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal("Employees added successfully");
        done();
      });
  })
  it("should not add those employees which already exists", (done) => {
    const departmentModelMock = {
      find: () => Promise.resolve([{
        _id: "mockdepartmentid",
        name: "mockdepartmentname"}])
    }
    const userModelMock = {
      findOne: () => Promise.resolve(mockUser2),
      insertMany: () => Promise.resolve()
    };
    Object.assign(Department, departmentModelMock);
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/admin/add-employees")
      .set("Authorization", "Bearer token")
      .send({
        orgId: "mockid",
        employees: [
          {
            email: "mockemail.com",
            firstname: "mockname",
            orgId: "mockid",
            departmentId: "mockdepartmentid",
          },
          
        ],
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal("Employees added successfully");
        done();
      });
  });
  it("should give 500 when adding failed", (done) => {
    const departmentModelMock = {
      find: () => Promise.resolve([{
        _id: "mockdepartmentid",
        name: "mockdepartmentname"}])
    }
    const userModelMock = {
      findOne: () => Promise.resolve(null),
      insertMany: () => Promise.reject({})
    };
    Object.assign(Department, departmentModelMock);
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/admin/add-employees")
      .set("Authorization", "Bearer token")
      .send({
        orgId: "mockid",
        employees: [
          {
            email: "mockemail.com",
            firstname: "mockname",
            orgId: "mockid",
            departmentId: "mockdepartmentid",
          },
          
        ],
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should give 500 when getting department failed", (done) => {
    const departmentModelMock = {
      find: () => Promise.reject({})
    }
    Object.assign(Department, departmentModelMock);
    chai
      .request(app)
      .post("/admin/add-employees")
      .set("Authorization", "Bearer token")
      .send({
        orgId: "mockid",
        employees: [
          {
            email: "mockemail.com",
            firstname: "mockname",
            orgId: "mockid",
            departmentId: "mockdepartmentid",
          },
          
        ],
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should give 500 when getting users failed", (done) => {
    const departmentModelMock = {
      find: () => Promise.resolve([{
        _id: "mockdepartmentid",
        name: "mockdepartmentname"}])
    }
    const userModelMock = {
      findOne: () => Promise.reject({})
    };
    Object.assign(Department, departmentModelMock);
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/admin/add-employees")
      .set("Authorization", "Bearer token")
      .send({
        orgId: "mockid",
        employees: [
          {
            email: "mockemail.com",
            firstname: "mockname",
            orgId: "mockid",
            departmentId: "mockdepartmentid",
          },
          
        ],
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe("Admin get all users route", () => {
  beforeEach(() => {
    sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = {
        role : "Admin"
      };
      callback(null, decodedToken);
    });
  });
  afterEach(() => {
    sinon.restore();
  });
  it("should get all users", (done) => {
    const userModelMock = {
      find: () => ({
        sort: () => Promise.resolve([mockUser2]),
      }),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .get("/admin/getAllUsers/mockid")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("users");
        done();
      });
  });
  it("should not get all users as users do not exist", (done) => {
    const userModelMock = {
      find: () => ({
        sort: () => Promise.resolve(null),
      }),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .get("/admin/getAllUsers/mockid")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it("should give 500 when something unusual happens", (done) => {
    const userModelMock = {
      find: () => ({
        sort: () => Promise.rejects()
      }),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .get("/admin/getAllUsers/mockid")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
}); 

describe("Admin get users count route", () => {
  beforeEach(() => {
    sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = {
        role : "Admin"
      };
      callback(null, decodedToken);
    });
  });
  afterEach(() => {
    sinon.restore();
  });
  it("should get users count", (done) => {
    const userModelMock = {
      countDocuments: () => Promise.resolve(1),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .get("/admin/getUsersCount/mockid")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("count");
        done();
      });
  });
  
  it("should give 500 when something unusual happens", (done) => {
    const userModelMock = {
      countDocuments: () => Promise.reject({}),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .get("/admin/getUsersCount/mockid")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe("Admin remove employee route", () => {
  beforeEach(() => {
    sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = {
        role : "Admin"
      };
      callback(null, decodedToken);
    });
  });
  afterEach(() => {
    sinon.restore();
  });
  it("should remove employee", (done) => {
    const userModelMock = {
      findByIdAndUpdate: () => ({
        lean: () => Promise.resolve(mockUser2),
      })
    }
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/admin/removeEmployee")
      .set("Authorization", "Bearer token")
      .send({
        userId:"mockid",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Employee removed successfully");
        done();
      });
  });
  it("should not remove employee as employee does not exist", (done) => {
    const userModelMock = {
      findByIdAndUpdate: () => ({
        lean: () => Promise.resolve(null),
    })
    }
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/admin/removeEmployee")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockid",
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it("should give 500 when something unusual happens", (done) => {
    const userModelMock = {
      findByIdAndUpdate: () => Promise.reject({}),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/admin/removeEmployee")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockid",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe("Admin remove employee from team route", () => {
  beforeEach(() => { 
    sinon.stub(jwt, "verify").callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = {
        role : "Admin"
      };
      callback(null, decodedToken);
    });
  });
  afterEach(() => {
    sinon.restore();
  });

  it("should remove employee from team", (done) => {
    const userModelMock = {
      findByIdAndUpdate: () => ({
        lean: () => Promise.resolve(mockUser2),
      })
    }
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/admin/removeEmployeeTeam")
      .set("Authorization", "Bearer token")
      .send({
        userId:"mockid",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal(
          "Employee removed from team removed successfully"
        );
        done();
      });
  });

  it("should not remove employee from team as employee does not exist", (done) => { 
    const userModelMock = {
      findByIdAndUpdate: () => ({
        lean: () => Promise.resolve(null),
      })
    }
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/admin/removeEmployeeTeam")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockid",
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  })
  it("should give 500 when something unusual happens", (done) => {
    const userModelMock = {
      findByIdAndUpdate: () => Promise.reject({}),
    };
    Object.assign(User, userModelMock);
    chai
      .request(app)
      .post("/admin/removeEmployeeTeam")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockid",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

});