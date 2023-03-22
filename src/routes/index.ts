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

// app.post('/login', passport.authenticate('local'), (req, res) => {
//   const token = generateToken(req.user.id);
//   res.json({ token });
// });

// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get(
//   '/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => {
//     const token = generateToken(req.user.id);
//     res.json({ token });
//   }
// );

// app.post('/register', async (req, res) => {
//   const { email, password, name } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   try {
//     const newUser = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//         name,
//       },
//     });

//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(400).json({ message: 'User registration failed', error });
//   }
// });

// app.get('/profile', ensureAuthenticated, (req, res) => {
//   res.json(req.user);
// });

router.use("/auth", authRoutes);

export default router;
