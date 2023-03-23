import express from "express";
import passport from "passport";
import validateToken from "../middleware/validateToken.middleware";
import authController from "../controllers/auth/authController";
import ssoController from "../controllers/sso/ssoController";

const router = express.Router();
const authRoutes = express.Router();

authRoutes.post("/login", passport.authenticate("local"), authController.Login);
authRoutes.post("/register", authController.Register);
authRoutes.get("/logout", validateToken, authController.Logout);

authRoutes.get("/google", ssoController.googleAuth);
authRoutes.get("/google/callback", ssoController.handleGoogleAuthCallback);

router.use("/auth", authRoutes);

export default router;
