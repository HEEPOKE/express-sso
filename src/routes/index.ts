import express from "express";
import passport from "passport";
import validateToken from "../middleware/validateToken.middleware";
import authController from "../controllers/auth/authController";

const router = express.Router();
const authRoutes = express.Router();

authRoutes.post("/login", authController.Login);
authRoutes.post("/register", authController.Register);
authRoutes.get("/logout", validateToken, authController.Logout);
authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/success");
  }
);
authRoutes.get("/success", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("You have successfully logged in with Google!");
  } else {
    res.redirect("/login");
  }
});

router.use("/auth", authRoutes);

export default router;
