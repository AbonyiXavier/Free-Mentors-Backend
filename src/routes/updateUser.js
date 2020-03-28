import express from "express";
import Auth from "../middlewares/verifyToken";
import updateController from "../controllers/updateUser";
import isAdmin from "../middlewares/isAdmin";

const router = express.Router();

router.patch("/user/:userId", Auth, isAdmin, updateController.updateUser);

export default router;
