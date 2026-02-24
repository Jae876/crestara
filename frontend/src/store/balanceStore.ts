import { create } from 'zustand';

interface BalanceState {
  balanceUSD: number;
  bonusBalance: number;
  setBalance: (balance: number, bonus: number) => void;
  incrementBalance: (amount: number) => void;
  decrementBalance: (amount: number) => void;
}

export const useBalanceStore = create<BalanceState>((set) => ({
  balanceUSD: 0,
  bonusBalance: 0,

  setBalance: (balance: number, bonus: number) => {
    set({ balanceUSD: balance, bonusBalance: bonus });
  },

  incrementBalance: (amount: number) => {
    set((state) => ({
      balanceUSD: state.balanceUSD + amount,
    }));
  },

  decrementBalance: (amount: number) => {
    set((state) => ({
      balanceUSD: Math.max(0, state.balanceUSD - amount),
    }));
  },
}));
