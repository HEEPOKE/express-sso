import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import session from "express-session";
import * as bodyParser from "body-parser";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config";
import prisma from "../prisma";

function configureMiddleware(app: any) {
  app.use(cors({ credentials: true }));
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(
    session({
      secret: config.SESSION_SECRET || "",
      resave: false,
      saveUninitialized: false,
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
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID!,
        clientSecret: config.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${config.BASE_URL}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        const { id, name, emails, photos } = profile;

        try {
          const existingUser = await prisma.user.findUnique({
            where: { googleId: id },
          });

          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = await prisma.user.create({
            data: {
              googleId: id,
              email: emails?.[0].value || "",
              firstName: name?.givenName,
              lastName: name?.familyName,
              photo: photos?.[0].value,
            },
          });

          return done(null, newUser);
        } catch (error: any) {
          console.error("Error creating or finding user:", error);
          return done(error);
        }
      }
    )
  );
}

const passportConfig = {
  configureMiddleware,
  configurePassport,
};

export default passportConfig;
