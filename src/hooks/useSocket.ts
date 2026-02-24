import { useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket = (url: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') => {
  useEffect(() => {
    const socket: Socket = io(url, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('notification', (data) => {
      console.log('Notification:', data);
    });

    socket.on('bet:won', (data) => {
      console.log('Bet won!', data);
    });

    socket.on('mining:payout', (data) => {
      console.log('Mining payout received!', data);
    });

    socket.on('price:update', (data) => {
      console.log('Price update:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, [url]);
};
