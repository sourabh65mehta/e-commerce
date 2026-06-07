import { loginUser, registerUser, getLoggedinUser } from "../controllers/user.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Protected routes
router.route("/me").get(verifyJWT, getLoggedinUser);

export { router };

