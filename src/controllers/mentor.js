import dbConnection from "../database/db";

export default class mentorController {
  static async getAllMentor(req, res) {
    try {
      const getAllMentor = `SELECT mentorId, firstName, lastName, email , password, 
      address, bio, occupation, expertise, isAdmin, role
      FROM mentor, user WHERE mentor.userId = user.userId `;
      let results = await dbConnection.query(getAllMentor);
      //   console.log(results);
      return res.status(200).json({
        status: "success",
        message: "All mentors details",
        results: results
      });
    } catch (error) {
      console.log(error);
    }
  }
}
