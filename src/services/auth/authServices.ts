import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import prisma from "../../prisma";
import tokenCommon from "../../common/tokenCommon";
import userCommon from "../../common/userCommon";
import LoginResponse from "../../models/Response/auth/LoginResponse";
import UserRequest from "../../models/Request/UserRequest";

async function Register(email: string, password: string, displayName: string) {
  const existingUser = await userCommon.findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, displayName, googleId: "" },
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

async function handleLocalAuth(
  email: string,
  password: string
): Promise<[Error | null, UserRequest | false, { message: string }?]> {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return [null, false, { message: "Incorrect email." }];
    }

    const validPassword = await bcrypt.compare(password, user.password!);
    if (!validPassword) {
      return [null, false, { message: "Incorrect password." }];
    }

    const userRequest: UserRequest = {
      id: user.id,
      email: user.email,
      displayName: user.displayName!,
      googleId: user.googleId!,
      password: user.password!,
    };

    return [null, userRequest];
  } catch (err) {
    return [err as Error, false] as [
      Error | null,
      UserRequest | false,
      { message: string }?
    ];
  }
}

const authService = {
  Register,
  Login,
  Logout,
  handleLocalAuth,
};

export default authService;
