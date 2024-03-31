const Survey = require("../models/survey");
const Employee = require("../models/employee");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const survey = require("../models/survey");

chai.use(chaiHttp);
const expect = chai.expect;

const mockSurvey = {
  title: "Survey 1",
  description: "Survey Description",
  orgId: "60f4d8e9f7e7f00015f2f4b3",
  createdOn: new Date(),
  deadline: new Date() + 1,
  questions: ["Question 1"],
  inclusionScore: 0,
  countOfUsersFilled: 0,
};

const mockSurveysArray = [
  new Survey({
    title: "Survey 1",
    description: "Survey Description",
    orgId: "60f4d8e9f7e7f00015f2f4b3",
    createdOn: new Date(),
    deadline: new Date() + 1,
    questions: ["Question 1"],
    inclusionScore: 0,
    countOfUsersFilled: 0,
  }),
  new Survey({
    title: "Survey 2",
    description: "Survey Description",
    orgId: "60f4d8e9f7e7f00015f2f4b3",
    createdOn: new Date(),
    deadline: new Date() + 1,
    questions: ["Question 1"],
    inclusionScore: 0,
    countOfUsersFilled: 0,
  }),
];
let mockUser2 = new Employee({
  firstname: "mockfirstname",
  email: "mockgmail.com",
  password: "mockpassword",
  orgId: "mockorgid",
  departmentId: "mockdepartmentid",
  dateOfJoining: new Date(),
  gender: "Male",
  surveyResponses: ["mockSurveyId"],
});

describe("Add Survey Route", () => {
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

  it("should return 201 status code when a survey is added", (done) => {
    sinon.stub(Survey.prototype, "save").resolves(mockSurvey);
    chai
      .request(app)
      .post("/survey/add")
      .set("Authorization", "Bearer token")
      .send({
        title: "Survey 1",
        description: "Survey Description",
        orgId: "60f4d8e9f7e7f00015f2f4b3",
        deadline: new Date() + 1,
        questions: ["Question 1"],
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal("Survey created successfully");
        done();
      });
  });
  it("should return 500 status code when a survey is not added", (done) => {
    sinon.stub(Survey.prototype, "save").throws();
    chai
      .request(app)
      .post("/survey/add")
      .set("Authorization", "Bearer token")
      .send({
        title: "Survey 1",
        description: "Survey Description",
        orgId: "60f4d8e9f7e7f00015f2f4b3",
        deadline: new Date() + 1,
        questions: ["Question 1"],
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe("Update Survey Route", () => {
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

  it("should return 200 status code when a survey is updated", (done) => {
    const surveyModelMock = {
      findById: () => Promise.resolve(mockSurveysArray[0]),
    };
    Object.assign(Survey, surveyModelMock);
    sinon.stub(Survey.prototype, "save").resolves(mockSurvey);
    chai
      .request(app)
      .post("/survey/update")
      .set("Authorization", "Bearer token")
      .send({
        id: "mockId",
        title: "Survey 1",
        description: "Survey Description",
        deadline: new Date() + 1,
        questions: ["Question 1"],
        allowResubmit: true,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Survey updated successfully");
        done();
      });
  });
  it("should return 409 status code when a survey is not found", (done) => {
    const surveyModelMock = {
      findById: () => Promise.resolve(null),
    };
    Object.assign(Survey, surveyModelMock);
    chai
      .request(app)
      .post("/survey/update")
      .set("Authorization", "Bearer token")
      .send({
        id: "mockId",
        title: "Survey 1",
        description: "Survey Description",
        deadline: new Date() + 1,
        questions: ["Question 1"],
        allowResubmit: true,
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        done();
      });
  });
  it("should return 500 status code when a survey is not updated", (done) => {
    const surveyModelMock = {
      findById: () => Promise.resolve(mockSurvey),
    };
    Object.assign(Survey, surveyModelMock);
    sinon.stub(Survey.prototype, "save").throws();
    chai
      .request(app)
      .post("/survey/update")
      .set("Authorization", "Bearer token")
      .send({
        id: "mockId",
        title: "Survey 1",
        description: "Survey Description",
        deadline: new Date() + 1,
        questions: ["Question 1"],
        allowResubmit: true,
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should return 500 status code when a survey fetching failed", (done) => {
    const surveyModelMock = {
      findById: () => Promise.reject(),
    };
    Object.assign(Survey, surveyModelMock);
    chai
      .request(app)
      .post("/survey/update")
      .set("Authorization", "Bearer token")
      .send({
        id: "mockId",
        title: "Survey 1",
        description: "Survey Description",
        deadline: new Date() + 1,
        questions: ["Question 1"],
        allowResubmit: true,
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe("Get All Survey Route", () => {
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
  it("should return 200 status code when surveys are fetched", (done) => {
    const surveyModelMock = {
      find: () => ({
        sort: () => Promise.resolve(mockSurveysArray),
      }),
    };
    Object.assign(Survey, surveyModelMock);
    chai
      .request(app)
      .get("/survey/get/orgId")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it("should return 500 status code when surveys are not fetched", (done) => {
    const surveyModelMock = {
      find: () => ({
        sort: () => Promise.reject(),
      }),
    };
    Object.assign(Survey, surveyModelMock);
    chai
      .request(app)
      .get("/survey/get/orgId")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  }); 
});

describe("Get User Survey Responses Route", () => {
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

  it("should return 200 status code when surveys are fetched", (done) => {
    const employeeModelMock = {
      findById: () => Promise.resolve(mockUser2),
    };
    Object.assign(Employee, employeeModelMock);
    chai
      .request(app)
      .get("/survey/getSurveys/mockUserId")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it("should return 404 status code when user is not found", (done) => {
    const employeeModelMock = {
      findById: () => Promise.resolve(null),
    };
    Object.assign(Employee, employeeModelMock);
    chai
      .request(app)
      .get("/survey/getSurveys/mockUserId")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
   });
  it("should return 500 status code when surveys are not fetched", (done) => {
    const employeeModelMock = {
      findById: () => Promise.reject(),
    };
    Object.assign(Employee, employeeModelMock);
    chai
      .request(app)
      .get("/survey/getSurveys/mockUserId")
      .set("Authorization", "Bearer token")
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe("Fill Survey Response Route", () => {
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

  it("should return 200 status code when survey response is filled", (done) => {
    const employeeModelMock = {
      findById: () => Promise.resolve(mockUser2),
    };
    Object.assign(Employee, employeeModelMock);
    const surveyModelMock = {
      findById: () => Promise.resolve(mockSurveysArray[0]),
    };
    Object.assign(Survey, surveyModelMock);
    sinon.stub(Survey.prototype, "save").resolves(mockSurvey);
    sinon.stub(Employee.prototype, "save").resolves(mockUser2);
    chai
      .request(app)
      .post("/survey/fillSurvey")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockUserId",
        surveyId: "mockSurveyId",
        score: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal(
          "Survey filled successfully"
        );
        done();
      });
  });
  it("should return 400 status code when survey is already filled", (done) => {
    const employeeModelMock = {
      findById: () => Promise.resolve(mockUser2),
    };
    Object.assign(Employee, employeeModelMock);
    const surveyModelMock = {
      findById: () => Promise.resolve(mockSurveysArray[0]),
    };
    Object.assign(Survey, surveyModelMock);
    mockUser2.surveyResponses = [{ surveyId: mockSurveysArray[0]._id, score: 5 }];
    sinon.stub(Employee.prototype, "save").resolves(mockUser2);
    chai
      .request(app)
      .post("/survey/fillSurvey")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockUserId",
        surveyId: mockSurveysArray[0]._id,
        score: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
  it("should return 404 status code when user is not found", (done) => {
    const employeeModelMock = {
      findById: () => Promise.resolve(null),
    };
    Object.assign(Employee, employeeModelMock);
    chai
      .request(app)
      .post("/survey/fillSurvey")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockUserId",
        surveyId: "mockSurveyId",
        score: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it("should return 404 status code when survey is not found", (done) => {
    const employeeModelMock = {
      findById: () => Promise.resolve(mockUser2),
    };
    Object.assign(Employee, employeeModelMock);
    const surveyModelMock = {
      findById: () => Promise.resolve(null),
    };
    Object.assign(Survey, surveyModelMock);
    chai
      .request(app)
      .post("/survey/fillSurvey")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockUserId",
        surveyId: "mockSurveyId",
        score: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it("should return 500 status code when survey response is not filled", (done) => {
    const employeeModelMock = {
      findById: () => Promise.resolve(mockUser2),
    };
    Object.assign(Employee, employeeModelMock);
    const surveyModelMock = {
      findById: () => Promise.resolve(mockSurveysArray[0]),
    };
    Object.assign(Survey, surveyModelMock);
    sinon.stub(Survey.prototype, "save").throws();
    chai
      .request(app)
      .post("/survey/fillSurvey")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockUserId",
        surveyId: "mockSurveyId",
        score: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should return 500 status code when user fetching failed", (done) => {
    const employeeModelMock = {
      findById: () => Promise.reject(),
    };
    Object.assign(Employee, employeeModelMock);
    chai
      .request(app)
      .post("/survey/fillSurvey")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockUserId",
        surveyId: "mockSurveyId",
        score: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should return 500 status code when survey fetching failed", (done) => {
    const employeeModelMock = {
      findById: () => Promise.resolve(mockUser2),
    };
    Object.assign(Employee, employeeModelMock);
    const surveyModelMock = {
      findById: () => Promise.reject(),
    };
    Object.assign(Survey, surveyModelMock);
    chai
      .request(app)
      .post("/survey/fillSurvey")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockUserId",
        surveyId: "mockSurveyId",
        score: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe("Update Survey Response Route", () => {
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
  it("should return 200 status code when survey response is updated", (done) => {
    const employeeModelMock = {
      findById: () => Promise.resolve(mockUser2),
    };
    Object.assign(Employee, employeeModelMock);
    const surveyModelMock = {
      findById: () => Promise.resolve(mockSurveysArray[0]),
    };
    Object.assign(Survey, surveyModelMock);
    mockUser2.surveyResponses = [
      { surveyId: mockSurveysArray[0]._id, score: 5 },
    ];
    sinon.stub(Survey.prototype, "save").resolves(mockSurvey);
    sinon.stub(Employee.prototype, "save").resolves(mockUser2);
    chai
      .request(app)
      .post("/survey/updateResponse")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockUserId",
        surveyId: mockSurveysArray[0]._id,
        score: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal(
          "Survey response updated successfully"
        );
        done();
      });
  });
  it("should return 404 status code when user not found", (done) => {
    const employeeModelMock = {
      findById: () => Promise.resolve(null),
    };
    Object.assign(Employee, employeeModelMock);
    chai
      .request(app)
      .post("/survey/updateResponse")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockUserId",
        surveyId: "mockSurveyId",
        score: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it("should return 404 status code when survey not found", (done) => {
    const employeeModelMock = {
      findById: () => Promise.resolve(mockUser2),
    };
    Object.assign(Employee, employeeModelMock);
    const surveyModelMock = {
      findById: () => Promise.resolve(null),
    };
    Object.assign(Survey, surveyModelMock);
    chai
      .request(app)
      .post("/survey/updateResponse")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockUserId",
        surveyId: "mockSurveyId",
        score: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it("should return 500 status code when survey response is not updated", (done) => {
    const employeeModelMock = {
      findById: () => Promise.resolve(mockUser2),
    };
    Object.assign(Employee, employeeModelMock);
    const surveyModelMock = {
      findById: () => Promise.resolve(mockSurveysArray[0]),
    };
    Object.assign(Survey, surveyModelMock);
    mockUser2.surveyResponses = [
      { surveyId: mockSurveysArray[0]._id, score: 5 },
    ];
    sinon.stub(Survey.prototype, "save").throws();
    chai
      .request(app)
      .post("/survey/updateResponse")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockUserId",
        surveyId: mockSurveysArray[0]._id,
        score: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should return 500 status code when user fetching failed", (done) => {
    const employeeModelMock = {
      findById: () => Promise.reject(),
    };
    Object.assign(Employee, employeeModelMock);
    chai
      .request(app)
      .post("/survey/updateResponse")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockUserId",
        surveyId: "mockSurveyId",
        score: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should return 500 status code when survey fetching failed", (done) => {
    const employeeModelMock = {
      findById: () => Promise.resolve(mockUser2),
    };
    Object.assign(Employee, employeeModelMock);
    const surveyModelMock = {
      findById: () => Promise.reject(),
    };
    Object.assign(Survey, surveyModelMock);
    chai
      .request(app)
      .post("/survey/updateResponse")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockUserId",
        surveyId: "mockSurveyId",
        score: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should return 500 when saving responses failed", (done) => {
    const employeeModelMock = {
      findById: () => Promise.resolve(mockUser2),
    };
    Object.assign(Employee, employeeModelMock);
    const surveyModelMock = {
      findById: () => Promise.resolve(mockSurveysArray[0]),
    };
    Object.assign(Survey, surveyModelMock);
    mockUser2.surveyResponses = [
      { surveyId: mockSurveysArray[0]._id, score: 5 },
    ];
    sinon.stub(Employee.prototype, "save").throws();
    chai
      .request(app)
      .post("/survey/updateResponse")
      .set("Authorization", "Bearer token")
      .send({
        userId: "mockUserId",
        surveyId: mockSurveysArray[0]._id,
        score: 5,
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  })
});
