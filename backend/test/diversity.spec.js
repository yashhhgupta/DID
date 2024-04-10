const Admin = require("../models/organization");
const Employee = require("../models/employee");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

chai.use(chaiHttp);
const expect = chai.expect;

let mockAdmin = {
  id: "mockid",
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
let mockDiversityData = [
  {
    k: "gender",
    v: [
      {
        count: 10,
        gender: "Male",
      },
      {
        count: 5,
        gender: "Female",
      },
    ],
  },
  {
    k: "sexualOrientation",
    v: [
      {
        count: 10,
        sexualOrientation: "Heterosexual",
      },
      {
        count: 5,
        sexualOrientation: "Homosexual",
      },
      {
        count: 18,
        sexualOrientation: null,
      },
    ],
  },
];

describe("Get Diversity Data", () => {
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
  it("should return diversity data", (done) => {
    const adminModelMock = {
      findById: () => Promise.resolve(mockAdmin),
    };
    const employeeModelMock = {
      aggregate: () => Promise.resolve([]),
    };
    Object.assign(Admin, adminModelMock);
    Object.assign(Employee, employeeModelMock);
    chai
      .request(app)
      .get(
        "/diversity/get/66065e7eba36cee0bc2627ab"
      )
      .set("Authorization", "Bearer mocktoken")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("diversityData");
        expect(res.body).to.have.property("dataVisibility");
        done();
      });
  });
  it("should return diversity data when filtered with team and dep Id", (done) => {
    const adminModelMock = {
      findById: () => Promise.resolve(mockAdmin),
    };
    const employeeModelMock = {
      aggregate: () => Promise.resolve([]),
    };
    Object.assign(Admin, adminModelMock);
    Object.assign(Employee, employeeModelMock);
    chai
      .request(app)
      .get(
        "/diversity/get/66065e7eba36cee0bc2627ab?depId=66065e7eba36cee0bc2627ab&teamId=66065e7eba36cee0bc2627ab&current=true"
      )
      .set("Authorization", "Bearer mocktoken")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("diversityData");
        expect(res.body).to.have.property("dataVisibility");
        done();
      });
  });
  it("should return error 404 if organization not found", (done) => {
    const adminModelMock = {
      findById: () => Promise.resolve(null),
    };
    Object.assign(Admin, adminModelMock);
    chai
      .request(app)
      .get("/diversity/get/66065e7eba36cee0bc2627ab")
      .set("Authorization", "Bearer mocktoken")
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it("should return error 500 if fetching organization failed", (done) => {
    const adminModelMock = {
      findById: () => Promise.reject(),
    };
    Object.assign(Admin, adminModelMock);
    chai
      .request(app)
      .get("/diversity/get/66065e7eba36cee0bc2627ab")
      .set("Authorization", "Bearer mocktoken")
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should return error 500 if fetching diversity data failed", (done) => {
    const adminModelMock = {
      findById: () => Promise.resolve(mockAdmin),
    };
    const employeeModelMock = {
      aggregate: () => Promise.reject(),
    };
    Object.assign(Admin, adminModelMock);
    Object.assign(Employee, employeeModelMock);
    chai
      .request(app)
      .get("/diversity/get/66065e7eba36cee0bc2627ab")
      .set("Authorization", "Bearer mocktoken")
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should return error 404 if no diversity data found", (done) => {
    const adminModelMock = {
      findById: () => Promise.resolve(mockAdmin),
    };
    const employeeModelMock = {
      aggregate: () => Promise.resolve(null),
    };
    Object.assign(Admin, adminModelMock);
    Object.assign(Employee, employeeModelMock);
    chai
      .request(app)
      .get("/diversity/get/66065e7eba36cee0bc2627ab")
      .set("Authorization", "Bearer mocktoken")
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});

describe("Get Diversity Score", () => {
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
  it("should return diversity score", (done) => {
    const adminModelMock = {
      findById: () => ({
            select: () => Promise.resolve({
                id:mockAdmin.id,
                weightage:mockAdmin.weightage
            }),
      }),
    };
    const employeeModelMock = {
      aggregate: () => Promise.resolve(mockDiversityData),
    };

    Object.assign(Admin, adminModelMock);
    Object.assign(Employee, employeeModelMock);
    chai
      .request(app)
      .post("/diversity/getScore/66065e7eba36cee0bc2627ab")
      .set("Authorization", "Bearer mocktoken")
      .send({ startYear: "2015-01-01", endYear: "2024-04-01" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it("should return diversity score when filtered with team or dep Id", (done) => {
    const adminModelMock = {
      findById: () => ({
            select: () => Promise.resolve({
                id:mockAdmin.id,
                weightage:mockAdmin.weightage
            }),
      }),
    };
    const employeeModelMock = {
      aggregate: () => Promise.resolve(mockDiversityData),
    };

    Object.assign(Admin, adminModelMock);
    Object.assign(Employee, employeeModelMock);
    chai
      .request(app)
      .post("/diversity/getScore/66065e7eba36cee0bc2627ab?depId=66065e7eba36cee0bc2627ab&teamId=66065e7eba36cee0bc2627ab")
      .set("Authorization", "Bearer mocktoken")
      .send({ startYear: "2015-01-01", endYear: "2024-04-01" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
    it("should return diversity score with default start and end year", (done) => {
        const adminModelMock = {
            findById: () => ({
                select: () => Promise.resolve({
                    id: mockAdmin.id,
                    weightage: mockAdmin.weightage
                }),
            }),
        }
        const employeeModelMock = {
            aggregate: () => Promise.resolve(mockDiversityData),
        }
        Object.assign(Admin, adminModelMock);
        Object.assign(Employee, employeeModelMock);
        chai.request(app)
            .post("/diversity/getScore/66065e7eba36cee0bc2627ab")
            .set("Authorization", "Bearer mocktoken")
            .end((err, res) => { 
                expect(res).to.have.status(200);
                done();
            })
    });
    it("should return error 404 if weightage not found", (done) => {
        const adminModelMock = {
            findById: () => ({
                select: () => Promise.resolve(null),
            }),
        }
        Object.assign(Admin, adminModelMock);
        chai.request(app)
            .post("/diversity/getScore/66065e7eba36cee0bc2627ab")
            .set("Authorization", "Bearer mocktoken")
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            })
    });
    it("should return error 500 if fetching weightage failed", (done) => {
        const adminModelMock = {
            findById: () => ({
                select: () => Promise.reject(),
            }),
        }
        Object.assign(Admin, adminModelMock);
        chai.request(app)
            .post("/diversity/getScore/66065e7eba36cee0bc2627ab")
            .set("Authorization", "Bearer mocktoken")
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            })
    });
    it("should return error 500 if fetching diversity data failed", (done) => { 
        const adminModelMock = {
            findById: () => ({
                select: () => Promise.resolve({
                    id: mockAdmin.id,
                    weightage: mockAdmin.weightage
                }),
            }),
        }
        const employeeModelMock = {
            aggregate: () => Promise.reject(),
        }
        Object.assign(Admin, adminModelMock);
        Object.assign(Employee, employeeModelMock);
        chai.request(app)
            .post("/diversity/getScore/66065e7eba36cee0bc2627ab")
            .set("Authorization", "Bearer mocktoken")
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            })
    });
});

describe("Update Data Visibility", () => { 
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
    it("should update data visibility", (done) => {
        const adminModelMock = {
          findByIdAndUpdate: () => Promise.resolve(mockAdmin),
        };
        Object.assign(Admin, adminModelMock);
        chai.request(app)
            .post("/diversity/updateDataVisibility")
            .set("Authorization", "Bearer mocktoken")
            .send({ dataVisibility: mockAdmin.dataVisibility })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.equal("Visibility Updated");
                done();
            })
    });
    it("should return error 500 if fetching organization failed", (done) => {
        const adminModelMock = {
          findByIdAndUpdate: () => Promise.reject(),
        };
        Object.assign(Admin, adminModelMock);
        chai.request(app)
            .post("/diversity/updateDataVisibility")
            .set("Authorization", "Bearer mocktoken")
            .send({ dataVisibility: mockAdmin.dataVisibility })
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            })
    });
    it("should return error 404 if organization not found", (done) => {
        const adminModelMock = {
          findByIdAndUpdate: () => Promise.resolve(null),
        };
        Object.assign(Admin, adminModelMock);
        chai.request(app)
            .post("/diversity/updateDataVisibility")
            .set("Authorization", "Bearer mocktoken")
            .send({ dataVisibility: mockAdmin.dataVisibility })
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            })
    });
    
});
