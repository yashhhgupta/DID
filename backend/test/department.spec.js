const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const Department = require("../models/department");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);
const expect = chai.expect;

const mockDepartment = {
  name: "Department 1",
  orgId: "60f4d8e9f7e7f00015f2f4b3",
};
const mockDepartmentsArray = [
    new Department({
        name: "Department 1",
        orgId: "60f4d8e9f7e7f00015f2f4b3",
    }),
    new Department({
        name: "Department 2",
        orgId: "60f4d8e9f7e7f00015f2f4b3",
    }),
]

describe(" Add Department Route", () => {
  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = { role: "Admin" };
      callback(null, decodedToken);
    });
  });
  afterEach(() => {
    sinon.restore();
  });
  it("should return 201 status code when a department is added", (done) => {
    const departmentModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(Department, departmentModelMock);
    sinon.stub(Department.prototype, "save").resolves(mockDepartment);
    chai
      .request(app)
      .post("/department/add")
      .set("Authorization", "Bearer token")
      .send({
        name: "Department 1",
        orgId: "mockOrgId",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal("Department created successfully");
        done();
      });
  });
  it("should return 409 status code when department already exists", (done) => {
    const departmentModelMock = {
      findOne: () => Promise.resolve(mockDepartment),
    };
    Object.assign(Department, departmentModelMock);
    chai
      .request(app)
      .post("/department/add")
      .set("Authorization", "Bearer token")
      .send({
        name: "Department 1",
        orgId: "mockOrgId",
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        done();
      });
  });
  it("should return 500 status code find fails", (done) => {
    const departmentModelMock = {
      findOne: () => Promise.reject(),
    };
    Object.assign(Department, departmentModelMock);
    chai
      .request(app)
      .post("/department/add")
      .set("Authorization", "Bearer token")
      .send({
        name: "Department 1",
        orgId: "mockOrgId",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should return 500 status code when save fails", (done) => {
    const departmentModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(Department, departmentModelMock);
    sinon.stub(Department.prototype, "save").rejects();
    chai
      .request(app)
      .post("/department/add")
      .set("Authorization", "Bearer token")
      .send({
        name: "Department 1",
        orgId: "mockOrgId",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe(" Add Multiple Departments Route", () => {
  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = { role: "Admin" };
      callback(null, decodedToken);
    });
  });
  afterEach(() => {
    sinon.restore();
  });

  it("should return 201 status code when multiple departments are added", (done) => {
    const departmentModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(Department, departmentModelMock);
    sinon.stub(Department, "insertMany").resolves([mockDepartment]);
    chai
      .request(app)
      .post("/department/addMultiple")
      .set("Authorization", "Bearer token")
      .send({
        departments: ["Department 1"],
        orgId: "mockOrgId",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal("Departments created successfully");
        done();
      });
  });
  it("should return 409 status code when department already exists", (done) => {
    const departmentModelMock = {
      findOne: () => Promise.resolve(mockDepartment),
    };
    Object.assign(Department, departmentModelMock);
    chai
      .request(app)
      .post("/department/addMultiple")
      .set("Authorization", "Bearer token")
      .send({
        departments: ["Department 1"],
        orgId: "mockOrgId",
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        done();
      });
  });
  it("should return 500 status code find fails", (done) => {
    const departmentModelMock = {
      findOne: () => Promise.reject(),
    };
    Object.assign(Department, departmentModelMock);
    chai
      .request(app)
      .post("/department/addMultiple")
      .set("Authorization", "Bearer token")
      .send({
        departments: ["Department 1"],
        orgId: "mockOrgId",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should return 500 status code when insertMany fails", (done) => {
    const departmentModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(Department, departmentModelMock);
    sinon.stub(Department, "insertMany").rejects();
    chai
      .request(app)
      .post("/department/addMultiple")
      .set("Authorization", "Bearer token")
      .send({
        departments: ["Department 1"],
        orgId: "mockOrgId",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe(" Get Departments Route", () => {
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

  it("should return 200 status code when departments are fetched", (done) => {
    const departmentModelMock = {
      find: () => Promise.resolve(mockDepartmentsArray),
    };
    Object.assign(Department, departmentModelMock);
    chai
      .request(app)
      .get("/department/getAll/60f4d8e9f7e7f00015f2f4b3")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Departments fetched successfully");
        done();
      });
  });
  it("should return 404 status code when no departments are found", (done) => {
    const departmentModelMock = {
      find: () => Promise.resolve(null),
    };
    Object.assign(Department, departmentModelMock);
    chai
      .request(app)
      .get("/department/getAll/60f4d8e9f7e7f00015f2f4b3")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it("should return 500 status code when find fails", (done) => {
    const departmentModelMock = {
      find: () => Promise.reject(),
    };
    Object.assign(Department, departmentModelMock);
    chai
      .request(app)
      .get("/department/getAll/60f4d8e9f7e7f00015f2f4b3")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});
