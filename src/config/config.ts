import * as dotenv from "dotenv";

dotenv.config();

const {
  BASE_URL,
  PORT,
  MY_SECRET_KEY,
  MY_REFRESH_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SESSION_SECRET,
} = process.env;

const config = {
  BASE_URL,
  PORT,
  MY_SECRET_KEY,
  MY_REFRESH_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SESSION_SECRET,
};

export default config;
