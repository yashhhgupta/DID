const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const Team = require("../models/team");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const Employee = require("../models/employee");

chai.use(chaiHttp);
const expect = chai.expect;

const mockTeam = {
  name: "Team 1",
  orgId: "60f4d8e9f7e7f00015f2f4b3",
  departmentId: "60f4d8e9f7e7f00015f2f4b3",
};
const mockTeamsArray = [
  new Team({
    name: "Team 1",
    orgId: "60f4d8e9f7e7f00015f2f4b3",
    departmentId: "60f4d8e9f7e7f00015f2f4b3",
  }),
  new Team({
    name: "Team 2",
    orgId: "60f4d8e9f7e7f00015f2f4b3",
    departmentId: "60f4d8e9f7e7f00015f2f4b3",
  }),
];

describe("Add Team Route", () => {
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

  it("should return 201 status code when a team is added", (done) => {
    const teamModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(Team, teamModelMock);
    sinon.stub(Team.prototype, "save").resolves(mockTeam);
    chai
      .request(app)
      .post("/team/add")
      .set("Authorization", "Bearer token")
      .send({
        name: "Team 1",
        orgId: "mockOrgId",
        departmentId: "mockDepartmentId",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal("Team created successfully");
        done();
      });
  });
  it("should return 409 status code when team already exists", (done) => {
    const teamModelMock = {
      findOne: () => Promise.resolve(mockTeam),
    };
    Object.assign(Team, teamModelMock);
    chai
      .request(app)
      .post("/team/add")
      .set("Authorization", "Bearer token")
      .send({
        name: "Team 1",
        orgId: "mockOrgId",
        departmentId: "mockDepartmentId",
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        done();
      });
  });
  it("should return 500 status code when team creation fails", (done) => {
    const teamModelMock = {
      findOne: () => Promise.reject(),
    };
    Object.assign(Team, teamModelMock);
    chai
      .request(app)
      .post("/team/add")
      .set("Authorization", "Bearer token")
      .send({
        name: "Team 1",
        orgId: "mockOrgId",
        departmentId: "mockDepartmentId",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should return 500 status code when save fails", (done) => {
    const teamModelMock = {
      findOne: () => Promise.resolve(null),
    };
    Object.assign(Team, teamModelMock);
    sinon.stub(Team.prototype, "save").rejects();
    chai
      .request(app)
      .post("/team/add")
      .set("Authorization", "Bearer token")
      .send({
        name: "Team 1",
        orgId: "mockOrgId",
        departmentId: "mockDepartmentId",
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe("Get Teams Route", () => {
  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "User"
      const decodedToken = { role: "User" };
      callback(null, decodedToken);
    });
  });
  afterEach(() => {
    sinon.restore();
  });
  it("should return 200 status code when teams are fetched", (done) => {
    const teamModelMock = {
      find: () => Promise.resolve(mockTeamsArray),
    };
    Object.assign(Team, teamModelMock);
    chai
      .request(app)
      .get("/team/getAll/mockOrgId")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it("should return 404 if no teams are found", (done) => {
    const teamModelMock = {
      find: () => Promise.resolve(null),
    };
    Object.assign(Team, teamModelMock);
    chai
      .request(app)
      .get("/team/getAll/mockOrgId")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it("should return 500 status code when fetching teams fails", (done) => {
    const teamModelMock = {
      find: () => Promise.reject(),
    };
    Object.assign(Team, teamModelMock);
    chai
      .request(app)
      .get("/team/getAll/mockOrgId")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe("Add employee to team", () => {
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
  it("should return 200 status code when team members are added", (done) => {
    const employeeModelMock = {
      updateMany: () => Promise.resolve(),
    };
    Object.assign(Employee, employeeModelMock);
    chai
      .request(app)
      .post("/team/addEmployee")
      .set("Authorization", "Bearer token")
      .send({
        teamId: "mockTeamId",
        members: ["mockEmployeeId"],
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Team members added successfully");
        done();
      });
  });
  it("should return 500 status code when adding team members fails", (done) => {
    const employeeModelMock = {
      updateMany: () => Promise.reject(),
    };
    Object.assign(Employee, employeeModelMock);
    chai
      .request(app)
      .post("/team/addEmployee")
      .set("Authorization", "Bearer token")
      .send({
        teamId: "mockTeamId",
        members: ["mockEmployeeId"],
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe("Delete Team Route", () => {
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
  it("should return 200 status code when team is deleted", (done) => {
    const teamModelMock = {
      findByIdAndDelete: () => Promise.resolve(),
    };
    const employeeModelMock = {
      updateMany: () => Promise.resolve(),
    };
    Object.assign(Team, teamModelMock);
    Object.assign(Employee, employeeModelMock);
    chai
      .request(app)
      .delete("/team/delete/mockTeamId")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Team deleted successfully");
        done();
      });
  });
    it("should return 500 status code when deleting team fails", (done) => {
    const teamModelMock = {
      findByIdAndDelete: () => Promise.reject(),
    };
    const employeeModelMock = {
      updateMany: () => Promise.resolve(),
    };
        Object.assign(Team, teamModelMock);
        Object.assign(Employee, employeeModelMock);
        chai
            .request(app)
            .delete("/team/delete/mockTeamId")
            .set("Authorization", "Bearer token")
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });
    it("should return 500 status code when updating employees fails", (done) => {
    const teamModelMock = {
      findByIdAndDelete: () => Promise.resolve(),
    };
    const employeeModelMock = {
      updateMany: () => Promise.reject(),
    };
        Object.assign(Team, teamModelMock);
        Object.assign(Employee, employeeModelMock);
        chai
            .request(app)
            .delete("/team/delete/mockTeamId")
            .set("Authorization", "Bearer token")
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });
});
