import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnection from "../database/db";
import signupValidation from "../Models/signup";

export default class updateController {
  static async updateUser(req, res) {
    try {
      let token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      console.log("my decoded", decoded);
      const userId = req.params.userId;
      const {
        firstName,
        lastName,
        email,
        password,
        address,
        bio,
        occupation,
        expertise,
        isAdmin,
        role
      } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const user = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        address,
        bio,
        occupation,
        expertise,
        isAdmin,
        role
      };

      const { error } = signupValidation(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      const updateQuery = "UPDATE user SET ? WHERE userId = ?";
      let result = await dbConnection.query(updateQuery, [user, userId]);
      return res.status(200).json({
        status: "success",
        message: "User account changed to mentor",
        result: result
      });
    } catch (error) {
      console.log(error);
    }
  }
}
