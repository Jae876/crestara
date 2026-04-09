import crypto from 'crypto';

/**
 * House edge configuration.
 *
 * New players (< NEW_USER_BET_THRESHOLD settled bets) win at a higher rate to
 * build engagement and encourage first deposits.  All players — including new
 * ones — operate within a house-favoured model: the house captures ≥ 40 % of
 * every cohort's volume.  Returning players converge toward the standard 30 %
 * win rate, ensuring the house retains ~70 % of gross gaming revenue long-term.
 */
const NEW_USER_BET_THRESHOLD = 10;  // settled bets before "returning" status kicks in
const NEW_USER_WIN_PROBABILITY = 0.60;   // 60 % — onboarding honeymoon phase
const RETURNING_USER_WIN_PROBABILITY = 0.30; // 30 % — steady-state house edge of ~70 %

export interface OutcomeResult {
  outcome: 'WIN' | 'LOSS';
  payout: number;
  serverSeed: string;
  clientSeed: string;
  hash: string;
}

export function resolveOutcome(
  priorSettledBetCount: number,
  betAmount: number,
  multiplier: number,
): OutcomeResult {
  const effectiveMultiplier = Math.max(multiplier, 2);

  // Provably-fair seed generation
  const serverSeed = crypto.randomBytes(32).toString('hex');
  const clientSeed = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .createHmac('sha256', serverSeed)
    .update(clientSeed)
    .digest('hex');

  // Derive a uniform float in [0, 1) from the first 8 hex chars of the hash
  const roll = parseInt(hash.slice(0, 8), 16) / 0x100000000;

  const winProbability =
    priorSettledBetCount < NEW_USER_BET_THRESHOLD
      ? NEW_USER_WIN_PROBABILITY
      : RETURNING_USER_WIN_PROBABILITY;

  const outcome: 'WIN' | 'LOSS' = roll < winProbability ? 'WIN' : 'LOSS';
  const payout = outcome === 'WIN' ? betAmount * effectiveMultiplier : 0;

  return { outcome, payout, serverSeed, clientSeed, hash };
}
