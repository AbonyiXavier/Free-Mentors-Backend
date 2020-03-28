import express from "express";
import Auth from "../middlewares/verifyToken";
import userController from "../controllers/user";

const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);

export default router;
