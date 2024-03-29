const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const sinon = require("sinon");
const { S3Client } = require("@aws-sdk/client-s3");
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Test cases while uploading to S3", () => {
  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    const jwtStub = sinon.stub(jwt, "verify");
    jwtStub.callsFake((token, secret, callback) => {
      // Mocking a decoded token with role "Admin"
      const decodedToken = { role: "User" };
      callback(null, decodedToken);
    });
  });

  it("should return statusCode 200 if file is added successfully", async () => {
    // Stub the behavior of S3Client send method to resolve promises
    const s3ClientStub = sinon.stub(S3Client.prototype, "send").resolves({});

    const response = await chai
      .request(app)
      .post("/service/upload")
      .set("Authorization", "Bearer mockedToken")
      .attach("file", "/home/yash/Desktop/DID/frontend/src/assets/bar.png");
    expect(response).to.have.status(200);
    s3ClientStub.restore();
  });

  it("Should return statusCode 400 if no file is selected", (done) => {
    chai
      .request(app)
      .post("/service/upload")
      .set("Authorization", "Bearer mockedToken")
      .send({})
      .end((err, response) => {
        expect(response).to.have.status(400);
        expect(response.body.message).to.equal("File not found");
        done();
      });
  });

  it("Should return statusCode 500 if there is error while sending file to S3", (done) => {
    const s3ClientStub = sinon
      .stub(S3Client.prototype, "send")
      .rejects(new Error("Test Error"));

    chai
      .request(app)
      .post("/service/upload")
      .set("Authorization", "Bearer mockedToken")
      .attach(
        "file",
        "/home/yash/Desktop/DID/frontend/src/assets/bar.png"
      )
      .end((err, response) => {
        expect(response).to.have.status(500);
        expect(response.body.message).to.equal("Error uploading files to S3");
        s3ClientStub.restore();
        done();
      });
  });
});
