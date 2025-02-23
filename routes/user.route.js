
import { Router } from "express";
import { USER_CONTROLLER } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/jwt.middelwares.js";

const router = Router();

router.post("/register", USER_CONTROLLER.register);
router.post("/login", USER_CONTROLLER.login);
router.get("/profile", verifyToken, USER_CONTROLLER.profile);
router.post("/updateProfile", verifyToken, USER_CONTROLLER.updateProfile);
router.post("/updateBottles", verifyToken, USER_CONTROLLER.updateBottles);
router.get("/scoreboard", verifyToken, USER_CONTROLLER.scoreboard);

export default router;