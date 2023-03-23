import { RequestHandler } from "express";
import passport from "passport";

const googleAuth: RequestHandler = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const ssoController = {
  googleAuth,
};

export default ssoController;
