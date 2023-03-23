import express from "express";
import router from "../routes";
import passportConfig from "../config/passport";

export default function server() {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  passportConfig.configureMiddleware(app);
  passportConfig.configurePassport();

  app.use("/api", router);

  return app;
}
