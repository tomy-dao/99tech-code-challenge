import User, { IUser } from '../models/User';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../configs';

export interface RegisterData {
  username: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
  };
  token: string;
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  const { username, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user
  const user = new User({
    username,
    password: hashedPassword
  });

  await user.save();

  // Generate JWT token
  const token = jwt.sign({ userId: user._id, username: user.username }, config.jwtSecret as string, { expiresIn: JWT_EXPIRES_IN as string } as SignOptions);

  return {
    user: {
      id: user._id?.toString() as string,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    token
  };
};

export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
  const { username, password } = loginData;

  // Find user by username
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('Invalid username or password');
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid username or password');
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id, username: user.username }, config.jwtSecret as string, { expiresIn: JWT_EXPIRES_IN as string } as SignOptions);

  return {
    user: {
      id: user._id?.toString() as string,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    token
  };
};

export const verifyToken = (token: string): { userId: string; username: string } => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret as string) as any;
    return {
      userId: decoded.userId,
      username: decoded.username
    };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  return await User.findById(userId).select('-password');
};

export const getMe = async (token: string): Promise<{ user: IUser }> => {
  try {
    // Verify and decode the token
    const decoded = verifyToken(token);
    
    // Get user by ID from the decoded token
    const user = await getUserById(decoded.userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      user
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get user from token');
  }
};
