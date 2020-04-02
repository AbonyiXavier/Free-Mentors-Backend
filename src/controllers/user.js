import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnection from "../database/db";
import signupValidation from "../Models/signup";

export default class userController {
  static async signUp(req, res) {
    console.log("show me body", req.body);
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
    const user = {
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
    };

    const { error } = signupValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const emailExist = "SELECT  COUNT( * ) AS count FROM user WHERE email = ?";
    dbConnection.query(emailExist, [email], (err, data, fields) => {
      // console.log(`i am error ${err}`);
      if (err) {
        res.send(err);
      } else {
        if (data[0].count > 0) {
          res.status(400).json({
            message: "Email Already Exist"
          });
        } else {
          bcrypt.hash(user.password, 10, (err, hash) => {
            if (err) {
              //   console.log(err);
              res.send(error);
            } else {
              user.password = hash;
              if (user.role === "mentor") {
                const saveNewUser = "INSERT INTO user SET ?";
                dbConnection.query(
                  saveNewUser,
                  user,
                  (error, results, fields) => {
                    if (error) {
                      console.log("you love error", error);
                      res.send({
                        status: "error"
                      });
                    } else {
                      const userId = results.insertId;
                      dbConnection.query(
                        "INSERT INTO mentor SET ?",
                        { userId },
                        function(err, reseults, fields) {
                          if (err) {
                            console.log("need my error", err);
                          }
                          // console.log(id);
                          const token = jwt.sign(
                            user,
                            process.env.TOKEN_SECRET,
                            {
                              // expiresIn: "3600s" // 1min
                            }
                          );
                          res.cookie("token", token);
                          res
                            .header("auth-token", token)
                            .status(201)
                            .json({
                              token,
                              message: "User created Successful",
                              user
                            });
                        }
                      );
                    }
                    //   console.log(results)
                  }
                );
              }
            }
          });
        }
      }
    });
  }
}
