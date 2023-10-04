import express from "express";
import {
  getAllUsers,
  getUserProfile,
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/all", getAllUsers);
router.get("/profile/:query", getUserProfile);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
