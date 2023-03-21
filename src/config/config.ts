import * as dotenv from "dotenv";

dotenv.config();

const {
  PORT,
  MY_SECRET_KEY,
  MY_REFRESH_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SESSION_SECRET,
} = process.env;

const config = {
  PORT,
  MY_SECRET_KEY,
  MY_REFRESH_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SESSION_SECRET,
};

export default config;
