import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import prisma from "../../prisma";
import userCommon from "../../common/userCommon";
import LoginRequest from "../../models/Request/auth/LoginRequest";
import LoginResponse from "../../models/Response/auth/LoginResponse";

async function Register(email: string, password: string, userName: string) {
  const existingUser = await userCommon.findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, userName, googleId: "" },
  });

  return user;
}

async function Login(credentials: LoginRequest): Promise<LoginResponse> {
  const { email, password } = credentials;
  const user = await userCommon.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordIsValid = await bcrypt.compare(password, user.password);

  if (!passwordIsValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ userId: user.id }, `${config.MY_SECRET_KEY}`, {
    expiresIn: "1h",
  });

  return { token };
}

async function Logout(userId: number): Promise<void> {
  // Implement logout functionality here, such as revoking the user's token or session
}

const authService = {
  Register,
  Login,
  Logout,
};

export default authService;
