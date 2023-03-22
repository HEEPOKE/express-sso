import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import prisma from "../../prisma";
import tokenCommon from "../../common/tokenCommon";
import userCommon from "../../common/userCommon";
import LoginResponse from "../../models/Response/auth/LoginResponse";

async function Register(email: string, password: string, name: string) {
  const existingUser = await userCommon.findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name, googleId: "" },
  });

  return user;
}

async function Login(id: string): Promise<LoginResponse> {
  const token = tokenCommon.generateToken({ userId: id }, "1h");

  return { token };
}

async function Logout(token: string): Promise<void> {
  try {
    const decoded: any = jwt.verify(token, `${config.MY_SECRET_KEY}`);

    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    tokenCommon.revokedTokens[token] = Date.now() + ttl * 1000;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

const authService = {
  Register,
  Login,
  Logout,
};

export default authService;
