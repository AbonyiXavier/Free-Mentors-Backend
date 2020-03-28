import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server";

const { expect } = chai;
chai.use(chaiHttp);
const url = "/auth";
describe("User authenticatation process", () => {
  describe("Register a user succesfully", async () => {
    it("should return a validation error", async () => {
      const res = await chai
        .request(server)
        .post(`${url}/signup`)
        .send({
          firstName: "xa",
          lastName: "fr",
          email: "g.com",
          password: "12",
          address: "kubwa",
          bio: "love js",
          occupation: "stud",
          expertise: "js",
          isAdmin: "11",
          role: "men"
        });
      expect(res).to.have.status(400);
    });
    it("should return Email already exists", async () => {
      const res = await chai
        .request(server)
        .post(`${url}/signup`)
        .send({
          firstName: "john",
          lastName: "okafor",
          email: "g@gmail.com",
          password: "123456",
          address: "gwarimpa",
          bio: "in love with  javascript",
          occupation: "student",
          expertise: "javascript",
          isAdmin: "1",
          role: "mentor"
        });
      expect(res).to.have.status(400);
    });
    it("should create an account succesfully", async () => {
      const res = await chai
        .request(server)
        .post(`${url}/signup`)
        .send({
          firstName: "sandra",
          lastName: "okafor",
          email: "f@gmail.com",
          password: "1234567",
          address: "kubwa",
          bio: "in love with nodejs",
          occupation: "student",
          expertise: "nodejs",
          isAdmin: "0",
          role: "not mentor"
        });
      expect(res.body).to.have.property("message");
    });
  });

  describe("Testing the login method", () => {
    it("should return a validation error", async () => {
      const res = await chai
        .request(server)
        .post(`${url}/signin`)
        .send({
          email: "xa.com",
          password: "12"
        });
      expect(res).to.have.status(400);
    });

    it("should return Email and password does not match", async () => {
      const res = await chai
        .request(server)
        .post(`${url}/signin`)
        .send({
          email: "g@gmail.com",
          password: "456789"
        });
      expect(res).to.have.status(400);
    });

    it("should login a user successfully", async () => {
      const res = await chai
        .request(server)
        .post(`${url}/signin`)
        .send({
          email: "d@gmail.com",
          password: "1234567"
        });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("message");
    });

    it("should return Email does not exits", async () => {
      const res = await chai
        .request(server)
        .post(`${url}/signin`)
        .send({
          email: "g@.com",
          password: "123456"
        });
      expect(res).to.have.status(400);
    });
  });
});
