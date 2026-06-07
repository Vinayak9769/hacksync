import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel';

const getSecret = () => {
  return process.env.JWT_SECRET || process.env.SESSION_SECRET || 'secret-jwt-key';
};

class AuthController {
  // POST /api/auth/signup
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ error: 'Name, email, and password are required' });
        return;
      }

      if (password.length < 8) {
        res.status(400).json({ error: 'Password must be at least 8 characters long' });
        return;
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        res.status(400).json({ error: 'An account with this email already exists' });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        onboarded: false,
        onboarding: {},
      });

      // Generate JWT
      const token = jwt.sign(
        { id: user._id, email: user.email },
        getSecret(),
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user,
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Registration failed', details: error.message });
    }
  }

  // POST /api/auth/login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const user = await UserModel.findOne({ email });
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password || '');
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user._id, email: user.email },
        getSecret(),
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Signed in successfully',
        token,
        user,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Sign in failed', details: error.message });
    }
  }

  // GET /api/auth/me
  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        success: true,
        user,
      });
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to fetch user profile', details: error.message });
    }
  }

  // POST /api/auth/onboarding
  async saveOnboarding(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const onboardingData = req.body;

      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            onboarding: onboardingData,
            onboarded: true,
          },
        },
        { new: true }
      );

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        success: true,
        message: 'Onboarding data saved successfully',
        user,
      });
    } catch (error: any) {
      console.error('Save onboarding error:', error);
      res.status(500).json({ error: 'Failed to save onboarding data', details: error.message });
    }
  }
}

export default new AuthController();
