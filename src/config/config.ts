import * as dotenv from "dotenv";

dotenv.config();

const {
  PORT,
  MY_SECRET_KEY,
  MY_REFRESH_KEY,
} = process.env;

const config = {
  PORT,
  MY_SECRET_KEY,
  MY_REFRESH_KEY,
};

export default config;