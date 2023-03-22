import cors from "cors";
import bcrypt from "bcrypt";
import helmet from "helmet";
import passport from "passport";
import session from "express-session";
import * as bodyParser from "body-parser";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config";
import prisma from "../prisma";

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
    new LocalStrategy(async (email: string, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
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
          let user = await prisma.user.findUnique({
            where: { googleId: profile.id },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
              },
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: id },
      });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  done(null, user);
});

const passportConfig = {
  configureMiddleware,
  configurePassport,
};

export default passportConfig;
