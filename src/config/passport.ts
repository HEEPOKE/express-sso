import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import session from "express-session";
import * as bodyParser from "body-parser";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config";
import prisma from "../prisma";
import authService from "../services/auth/authServices";
import ssoServices from "../services/sso/ssoServices";

function configureMiddleware(app: any) {
  app.use(cors({ credentials: true }));
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(app.urlencoded({ extended: false }));
  app.use(
    session({
      secret: config.SESSION_SECRET || "",
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
}

function configurePassport() {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email: string, password: string, done) => {
        const [err, user, info] = await authService.handleLocalAuth(email, password);
        done(err, user, info);
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: `${config.GOOGLE_CLIENT_ID}`,
        clientSecret: `${config.GOOGLE_CLIENT_SECRET}`,
        callbackURL: "/auth/google/callback",
      },
      async (
        _accessToken: any,
        _refreshToken: any,
        profile: any,
        done: any
      ) => {
        try {
          const user = await ssoServices.handleGoogleAuth(
            _accessToken,
            _refreshToken,
            profile
          );
          done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id!);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user!);
    } catch (err) {
      done(err);
    }
  });
}

const passportConfig = {
  configureMiddleware,
  configurePassport,
};

export default passportConfig;
