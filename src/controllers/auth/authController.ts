import { Request, Response } from "express";
import LoginRequest from "../../models/Request/auth/LoginRequest";
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
    const user = req.user as LoginRequest;
    const id = user.id;

    if (!id) {
      res.status(400).json({ message: 'User ID is missing' });
      return;
    }

    const response = await authServices.Login(id);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

async function Logout(req: Request, res: Response) {
    try {
        const token = req.headers.authorization?.split(" ")[1] || "";
    
        if (!token) {
          throw new Error("Token is required");
        }
    
        await authServices.Logout(token);
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
