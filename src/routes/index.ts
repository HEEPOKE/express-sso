import express from "express";
import validateToken from "../middleware/validateToken.middleware";
import authController from "../controllers/auth/authController";

const router = express.Router();
const authRoutes = express.Router();

authRoutes.post("/login", authController.Login);
authRoutes.post("/register", authController.Register);
authRoutes.get("/logout", validateToken, authController.Logout);

router.use("/auth", authRoutes);

export default router;