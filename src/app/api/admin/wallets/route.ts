import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

const ADMIN_KEY = 'jaeseanjae';
const WALLET_KEYS = ['WALLET_BTC', 'WALLET_ETH', 'WALLET_USDT_ERC20', 'WALLET_USDT_TRC20', 'WALLET_LTC', 'WALLET_DOGE'];

function isAuthorized(request: NextRequest): boolean {
  return request.headers.get('X-Admin-Key') === ADMIN_KEY;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
}
