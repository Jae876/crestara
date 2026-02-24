import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { UserDTO, AuthResponse, TransactionDTO, BetDTO, MiningBotDTO } from '@crestara/shared';

// Auth hooks
export const useLogin = (): UseMutationResult<AuthResponse, Error, any> => {
  return useMutation({
    mutationFn: async (credentials) => {
      const { data } = await apiClient.post('/auth/login', credentials);
      return data;
    },
  });
};

export const useSignUp = (): UseMutationResult<AuthResponse, Error, any> => {
  return useMutation({
    mutationFn: async (input) => {
      const { data } = await apiClient.post('/auth/signup', input);
      return data;
    },
  });
};

// Funding hooks
export const useCoins = (): UseQueryResult<any[], Error> => {
  return useQuery({
    queryKey: ['coins'],
    queryFn: async () => {
      const { data } = await apiClient.get('/funding/coins');
      return data;
    },
  });
};

export const useInitiateDeposit = (): UseMutationResult<any, Error, any> => {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post('/funding/deposit/initiate', payload);
      return data;
    },
  });
};

export const useTransactions = (): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data } = await apiClient.get('/funding/transactions');
      return data;
    },
  });
};

// Mining hooks
export const useMiningPackages = (): UseQueryResult<any[], Error> => {
  return useQuery({
    queryKey: ['mining-packages'],
    queryFn: async () => {
      const { data } = await apiClient.get('/mining/packages');
      return data;
    },
  });
};

export const usePurchaseBot = (): UseMutationResult<any, Error, any> => {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post('/mining/bot/purchase', payload);
      return data;
    },
  });
};

export const useUserBots = (): UseQueryResult<MiningBotDTO[], Error> => {
  return useQuery({
    queryKey: ['user-bots'],
    queryFn: async () => {
      const { data } = await apiClient.get('/mining/bots');
      return data;
    },
  });
};

// Casino hooks
export const useGames = (): UseQueryResult<any[], Error> => {
  return useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const { data } = await apiClient.get('/casino/games');
      return data;
    },
  });
};

export const usePlaceBet = (): UseMutationResult<any, Error, any> => {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post('/casino/bet/place', payload);
      return data;
    },
  });
};

export const useUserBets = (): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: ['user-bets'],
    queryFn: async () => {
      const { data } = await apiClient.get('/casino/bets');
      return data;
    },
  });
};

// Referral hooks
export const useReferralStats = (): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: ['referral-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/referral/stats');
      return data;
    },
  });
};
