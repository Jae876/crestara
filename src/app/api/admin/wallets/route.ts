import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { extractToken, verifyToken, requireAdmin } from '@/lib/auth-middleware';

const WALLET_KEYS = ['WALLET_BTC', 'WALLET_ETH', 'WALLET_USDT_ERC20', 'WALLET_USDT_TRC20', 'WALLET_LTC', 'WALLET_DOGE'];

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);
    requireAdmin(auth);

    const configs = await prisma.systemConfig.findMany({
      where: { key: { in: WALLET_KEYS } },
    });

    const wallets = WALLET_KEYS.map((key) => {
      const cfg = configs.find((c) => c.key === key);
      return {
        key,
        coin: key.replace('WALLET_', '').replace('_ERC20', ' (ERC-20)').replace('_TRC20', ' (TRC-20)'),
        address: cfg?.value || '',
        description: cfg?.description || '',
        updatedAt: cfg?.updatedAt || null,
      };
    });

    return NextResponse.json({ wallets });
  } catch (error: any) {
    const status = error.message?.includes('Admin') ? 403 : 401;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);
    requireAdmin(auth);

    const { key, address, description } = await request.json();

    if (!WALLET_KEYS.includes(key)) {
      return NextResponse.json({ error: 'Invalid wallet key' }, { status: 400 });
    }
    if (!address?.trim()) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    const config = await prisma.systemConfig.upsert({
      where: { key },
      create: { key, value: address.trim(), description: description || key },
      update: { value: address.trim(), description: description || key },
    });

    return NextResponse.json({ config });
  } catch (error: any) {
    const status = error.message?.includes('Admin') ? 403 : 401;
    return NextResponse.json({ error: error.message }, { status });
  }
}
