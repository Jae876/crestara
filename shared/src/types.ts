// ===============================================
// CRESTARA SHARED TYPES
// ===============================================

/**
 * User Roles
 */
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

/**
 * KYC Status
 */
export enum KycStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

/**
 * Transaction Type
 */
export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  GAME_PAYOUT = 'GAME_PAYOUT',
  MINING_PAYOUT = 'MINING_PAYOUT',
  BONUS_CREDIT = 'BONUS_CREDIT',
  REFERRAL_BONUS = 'REFERRAL_BONUS',
}

/**
 * Transaction Status
 */
export enum TransactionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
}

/**
 * Game Type
 */
export enum GameType {
  CRASH = 'CRASH',
  PLINKO = 'PLINKO',
  DICE = 'DICE',
  MINES = 'MINES',
  COINFLIP = 'COINFLIP',
  KENO = 'KENO',
  SLOTS = 'SLOTS',
  ROULETTE = 'ROULETTE',
}

/**
 * Mining Package Type
 */
export enum MiningPackageType {
  BASIC = 'BASIC',
  PRO = 'PRO',
  ELITE = 'ELITE',
}

/**
 * Cryptocurrency symbols
 */
export const SUPPORTED_COINS = [
  'BTC', 'ETH', 'SOL', 'USDT', 'USDC', 'BNB', 'ADA', 'DOGE',
  'XMR', 'LTC', 'RVN', 'ZEC', 'XRP', 'TRX', 'LINK', 'MATIC',
  'DOT', 'AVAX', 'ARB', 'AAVE', 'UNI', 'SUSHI', 'FTM', 'ATOM',
] as const;

export type CoinSymbol = (typeof SUPPORTED_COINS)[number];

/**
 * Blockchain Networks
 */
export enum NetworkType {
  ETHEREUM = 'ethereum',
  BSC = 'bsc',
  SOLANA = 'solana',
  POLYGON = 'polygon',
  AVALANCHE = 'avalanche',
  ARBITRUM = 'arbitrum',
  BITCOIN = 'bitcoin',
  LITECOIN = 'litecoin',
  MONERO = 'monero',
  ZCASH = 'zcash',
  RIPPLE = 'ripple',
  TRON = 'tron',
  COSMOS = 'cosmos',
  POLKADOT = 'polkadot',
  OTHER = 'other',
}

/**
 * User DTO (from API)
 */
export interface UserDTO {
  id: string;
  email: string;
  role: UserRole;
  balanceUSD: number;
  bonusBalance: number;
  referralCode: string;
  referredById?: string | null;
  kycStatus: KycStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Auth Response
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}

/**
 * Transaction DTO
 */
export interface TransactionDTO {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  coinSymbol: CoinSymbol;
  amount: number;
  amountUSD: number;
  networkType: NetworkType;
  txHash?: string;
  destinationAddress?: string;
  depositAddress?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mining Bot DTO
 */
export interface MiningBotDTO {
  id: string;
  userId: string;
  packageType: MiningPackageType;
  coin: CoinSymbol;
  activationDate: string;
  endDate: string;
  dailyRate: number;
  totalMined: number;
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  createdAt: string;
}

/**
 * Bet DTO
 */
export interface BetDTO {
  id: string;
  userId: string;
  gameType: GameType;
  betAmount: number;
  multiplier: number;
  payout: number;
  outcome: 'WIN' | 'LOSS';
  hash?: string; // Provably fair hash
  createdAt: string;
}

/**
 * Bonus DTO
 */
export interface BonusDTO {
  id: string;
  userId: string;
  type: 'WELCOME' | 'FREE_SPINS' | 'REFERRAL';
  amount: number;
  wagerRequired: number;
  wagered: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Referral DTO
 */
export interface ReferralDTO {
  id: string;
  referrerId: string;
  referredUserId: string;
  referralCode: string;
  status: 'PENDING' | 'CONVERTED' | 'CREDITED';
  bonusAmount: number;
  createdAt: string;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * API Error Response
 */
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
}

/**
 * Real-time event payloads (Socket.io)
 */
export interface BetWonEvent {
  betId: string;
  userId: string;
  gameType: GameType;
  payout: number;
  timestamp: string;
}

export interface MiningPayoutEvent {
  botId: string;
  userId: string;
  coin: CoinSymbol;
  amount: number;
  timestamp: string;
}

export interface DepositConfirmedEvent {
  transactionId: string;
  userId: string;
  coin: CoinSymbol;
  amount: number;
  amountUSD: number;
  timestamp: string;
}

export interface CoinPriceUpdate {
  coin: CoinSymbol;
  priceUSD: number;
  change24h: number;
  marketCap?: number;
  timestamp: string;
}
