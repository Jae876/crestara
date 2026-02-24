import { z } from 'zod';
import { CoinSymbol, SUPPORTED_COINS } from './types';

/**
 * Validation Schemas for Crestara API
 */

// Auth DTOs
export const SignUpSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const OtpVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

// Coin / Funding DTOs
export const DepositInitiateSchema = z.object({
  coin: z.enum(SUPPORTED_COINS as [string, ...string[]]),
  amount: z.number().positive('Amount must be positive'),
});

export const WithdrawSchema = z.object({
  coin: z.enum(SUPPORTED_COINS as [string, ...string[]]),
  amount: z.number().positive(),
  destinationAddress: z.string(),
});

// Mining Bot DTOs
export const MiningBotPurchaseSchema = z.object({
  packageType: z.enum(['BASIC', 'PRO', 'ELITE']),
  coin: z.enum(SUPPORTED_COINS as [string, ...string[]]),
});

// Bet DTOs
export const PlaceBetSchema = z.object({
  gameType: z.enum(['CRASH', 'PLINKO', 'DICE', 'MINES', 'COINFLIP', 'KENO']),
  betAmount: z.number().positive().max(10000), // Max bet limit
  multiplier: z.number().optional(), // For some games
});

// Pagination
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
});

// Admin DTOs
export const UpdateUserBalanceSchema = z.object({
  userId: z.string().uuid(),
  newBalance: z.number().nonnegative(),
  note: z.string().optional(),
});

export const BanUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().min(10),
});

export const UpdateGameHouseEdgeSchema = z.object({
  gameType: z.enum(['CRASH', 'PLINKO', 'DICE', 'MINES', 'COINFLIP', 'KENO']),
  houseEdge: z.number().min(0).max(100), // Percentage
});

// Type Extraction (for TypeScript inference)
export type SignUpRequest = z.infer<typeof SignUpSchema>;
export type LoginRequest = z.infer<typeof LoginSchema>;
export type DepositInitiateRequest = z.infer<typeof DepositInitiateSchema>;
export type WithdrawRequest = z.infer<typeof WithdrawSchema>;
export type MiningBotPurchaseRequest = z.infer<typeof MiningBotPurchaseSchema>;
export type PlaceBetRequest = z.infer<typeof PlaceBetSchema>;
export type UpdateUserBalanceRequest = z.infer<typeof UpdateUserBalanceSchema>;
