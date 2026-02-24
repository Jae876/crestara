import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken, requireAdmin } from '@/lib/auth-middleware';
import { AdminService } from '@/lib/services/admin.service';

const adminService = new AdminService();

/**
 * GET /api/admin
 * Get admin dashboard overview and statistics
 * REQUIRES: Admin authentication
 */
export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);
    requireAdmin(auth);

    // Get various stats
    const [health, gameStats, miningStats] = await Promise.all([
      adminService.getSystemHealth(),
      adminService.getGameStats(),
      adminService.getMiningStats(),
    ]);

    return NextResponse.json({
      message: 'Admin Dashboard',
      health,
      gameStats,
      miningStats,
    });
  } catch (error: any) {
    const status = error.message === 'Admin access required' ? 403 : 401;
    return NextResponse.json({ error: error.message }, { status });
  }
}

/**
 * POST /api/admin
 * Execute admin actions based on action type
 * REQUIRES: Admin authentication
 * 
 * Actions:
 * - get_users
 * - get_transactions
 * - get_bets
 * - update_game_config
 * - update_user_balance
 */
export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    const auth = verifyToken(token);
    requireAdmin(auth);

    const body = await request.json();
    const { action, ...params } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'action parameter required' },
        { status: 400 },
      );
    }

    let result;

    switch (action) {
      case 'get_users':
        result = await adminService.getUsers(params.page, params.pageSize);
        break;

      case 'get_user':
        if (!params.userId) throw new Error('userId required');
        result = await adminService.getUser(params.userId);
        break;

      case 'get_transactions':
        result = await adminService.getTransactions(params.page, params.pageSize, params.filters);
        break;

      case 'get_bets':
        result = await adminService.getBets(params.page, params.pageSize, params.filters);
        break;

      case 'get_game_stats':
        result = await adminService.getGameStats();
        break;

      case 'get_mining_stats':
        result = await adminService.getMiningStats();
        break;

      case 'update_game_config':
        if (!params.gameType || params.houseEdgePercent === undefined) {
          throw new Error('gameType and houseEdgePercent required');
        }
        result = await adminService.updateGameConfig(
          params.gameType,
          params.houseEdgePercent,
          params.minBet,
          params.maxBet,
        );
        break;

      case 'update_user_balance':
        if (!params.userId || params.newBalance === undefined) {
          throw new Error('userId and newBalance required');
        }
        result = await adminService.updateUserBalance(
          params.userId,
          params.newBalance,
          params.note,
        );
        break;

      case 'ban_user':
        if (!params.userId || !params.reason) {
          throw new Error('userId and reason required');
        }
        result = await adminService.banUser(params.userId, params.reason);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }

    return NextResponse.json({ action, data: result });
  } catch (error: any) {
    const status = 
      error.message === 'Admin access required' ? 403 :
      error.message?.includes('required') ? 400 :
      401;
    return NextResponse.json({ error: error.message }, { status });
  }
}
