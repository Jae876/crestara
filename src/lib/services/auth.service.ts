import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { SignUpRequest, LoginRequest, AuthResponse } from '@crestara/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async signUp(input: SignUpRequest): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await argon2.hash(input.password);
    const referralCode = randomUUID();

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        referralCode,
      },
    });

    // Grant welcome bonus
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days
    await this.prisma.bonus.create({
      data: {
        userId: user.id,
        type: 'FREE_SPINS',
        amount: 2,
        wagerRequired: 1,
        expiresAt,
      },
    });

    return this.generateAuthResponse(user);
  }

  async login(input: LoginRequest): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, input.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return this.generateAuthResponse(user);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;

      const user = await this.prisma.user.findUnique({
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

  async getCurrentUser(token: string): Promise<any> {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      throw new Error('Unauthorized');
    }
  }

  private generateAuthResponse(user: any): AuthResponse {
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

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
