import { RequestHandler, Request, Response } from "express";
import passport from "passport";
import config from "../../config/config";
import tokenCommon from "../../common/tokenCommon";

const googleAuth: RequestHandler = passport.authenticate("google", {
  scope: ["profile", "email"],
});

function handleGoogleAuthCallback(req: Request, res: Response) {
  passport.authenticate("google", { failureRedirect: "/login" }, (err, user) => {
    if (err) {
      return res.redirect(`${config.ENDPOINT_URL}/auth/login`);
    }
    if (!user) {
      return res.redirect(`${config.ENDPOINT_URL}/auth/login`);
    }
    const token = tokenCommon.generateToken({ id: user.id }, "1d");
    res.json({ token });
  })(req, res);
}

const ssoController = {
  googleAuth,
  handleGoogleAuthCallback
};

export default ssoController;
