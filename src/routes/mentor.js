import express from "express";
import Auth from "../middlewares/verifyToken";
import mentorController from "../controllers/mentor";

const router = express.Router();

router.get("/mentors", Auth, mentorController.getAllMentor);

export default router;
