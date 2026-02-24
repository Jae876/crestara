import prisma from '@/lib/db';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { SignUpRequest, LoginRequest } from '@crestara/shared';
import { User, UserRole } from '@prisma/client';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be set in environment');
}

export class AuthService {
  async signUp(input: SignUpRequest): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password with Argon2
    const passwordHash = await argon2.hash(input.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64MB
      timeCost: 3,
      parallelism: 1,
    });
    const referralCode = randomUUID();

    // Create user
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        referralCode,
      },
    });

    // Grant welcome bonus
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days
    await prisma.bonus.create({
      data: {
        userId: user.id,
        type: 'FREE_SPINS',
        amount: 2,
        wagerRequired: 1,
        expiresAt,
      },
    });

    // Log signup
    await this.logAudit(user.id, 'USER_SIGNUP', 'user', { email: input.email });

    return this.generateAuthResponse(user);
  }

  async login(input: LoginRequest): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, input.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Log login
    await this.logAudit(user.id, 'USER_LOGIN', 'user', {});

    return this.generateAuthResponse(user);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;

      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return this.generateAuthResponse(user);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async getCurrentUser(token: string): Promise<Omit<User, 'passwordHash'>> {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error('Unauthorized');
    }
  }

  private generateAuthResponse(user: User): AuthResponse {
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' },
    );

    const refreshToken = jwt.sign(
      { sub: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' },
    );

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  private async logAudit(userId: string, action: string, resource: string, details: any) {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action,
          resource,
          details,
        },
      });
    } catch (err) {
      console.error('Failed to log audit:', err);
    }
  }
}
