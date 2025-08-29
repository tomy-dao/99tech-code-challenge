import { Request, Response } from 'express';
import { registerUser, loginUser, RegisterData, LoginData, getMe as getMeFromToken } from '../modules/user';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password }: RegisterData = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required'
      });
    }

    const result = await registerUser({ username, password });

    res.status(201).json({
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Username already exists') {
      return res.status(409).json({
        error: error.message
      });
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password }: LoginData = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required'
      });
    }

    const result = await loginUser({ username, password });

    res.status(200).json({
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid username or password') {
      return res.status(401).json({
        error: error.message
      });
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authorization token required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const result = await getMeFromToken(token);

    res.status(200).json({
      message: 'User retrieved successfully',
      data: result
    });
  } catch (error) {
    console.log("getMe error", error);
    if (error instanceof Error) {
      if (error.message === 'Invalid or expired token' || error.message === 'User not found') {
        return res.status(401).json({
          error: error.message
        });
      }
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

