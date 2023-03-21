import { Request, Response } from "express";
import authServices from "../../services/auth/authServices";

async function Register(req: Request, res: Response) {
  try {
    const { email, password, userName } = req.body;
    const user = await authServices.Register(email, password, userName);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

async function Login(req: Request, res: Response) {
  try {
    const credentials = {
      email: req.body.email,
      password: req.body.password,
    };
    const response = await authServices.Login(credentials);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

async function Logout(req: Request, res: Response) {
  try {
    const userId: number = parseInt(req.params.userId);
    await authServices.Logout(userId);
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

const authController = {
  Register,
  Login,
  Logout,
};

export default authController;
