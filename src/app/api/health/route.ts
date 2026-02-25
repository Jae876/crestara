import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

/**
 * Health Check Endpoint
 * GET /api/health
 * 
 * Returns application and database status
 * Used by Vercel for deployment verification
 */
export async function GET() {
  try {
    const startTime = Date.now();

    // Test database connection
    const userCount = await prisma.user.count();
    
    const dbLatency = Date.now() - startTime;

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: {
          connected: true,
          latency_ms: dbLatency,
          user_count: userCount,
        },
        environment: process.env.NODE_ENV,
        version: '1.0.0',
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('[HEALTH CHECK] Database connection failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
          error: error.message,
        },
        environment: process.env.NODE_ENV,
      },
      { status: 503 },
    );
  }
}
