import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnection from "../database/db";
import signupValidation from "../Models/signup";
import signinValidation from "../Models/signin";

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
              const saveNewUser = "INSERT INTO user SET ?";
              dbConnection.query(
                saveNewUser,
                user,
                (error, results, fields) => {
                  if (error) {
                    res.send({
                      status: "error"
                    });
                  } else {
                    // console.log(id);
                    const token = jwt.sign(user, process.env.TOKEN_SECRET, {
                      // expiresIn: "3600s" // 1min
                    });
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
                  //   console.log(results);
                }
              );
            }
          });
        }
      }
    });
  }

  static async signIn(req, res) {
    console.log("signin details", req.body);
    const { email, password } = req.body;
    const { error } = signinValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const userEmail = "SELECT * FROM user WHERE email = ?";
    dbConnection.query(userEmail, [email], (error, results, fields) => {
      console.log(results);
      if (error) {
        res.json({
          status: false,
          message: "please debug me!!!"
        });
      } else {
        if (results.length > 0) {
          const match = bcrypt.compareSync(password, results[0].password);
          if (match) {
            const token = jwt.sign(
              { id: results[0].id, isAdmin: results[0].isAdmin },
              process.env.TOKEN_SECRET,
              {
                // expiresIn: "3600s" // 1min
                expiresIn: 60 * 24 // 24hours
              }
            );
            res
              .header("auth-token", token)
              .status(200)
              .json({
                status: "success",
                message: "User is successfully logged in!",
                token
                // user
              });
          } else {
            res.status(400).json({
              status: "failed",
              message: "Email and password does not match"
            });
          }
        } else {
          res.status(400).json({
            status: "failed",
            message: "Email does not exits"
          });
        }
      }
    });
  }
}
