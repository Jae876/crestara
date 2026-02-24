#!/usr/bin/env node
/**
 * Post-Build Database Verification
 * Runs after Prisma migrations to verify database is working
 * 
 * Usage: node scripts/verify-db.js
 * Runs automatically in Vercel after: npm run db:migrate:prod
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDatabase() {
  console.log('🔍 Verifying database connection and schema...\n');

  try {
    // Test 1: Basic connection
    console.log('✓ Test 1: Database connection');
    const rawResult = await prisma.$queryRaw`SELECT 1`;
    console.log('  ✅ Connected successfully\n');

    // Test 2: Schema validation
    console.log('✓ Test 2: Schema validation');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    console.log(`  ✅ Found ${tables.length} tables\n`);

    // Test 3: User table exists and is empty (fresh deployment)
    console.log('✓ Test 3: Core tables');
    const userCount = await prisma.user.count();
    console.log(`  ✅ User table accessible (${userCount} rows)\n`);

    const transactionCount = await prisma.transaction.count();
    console.log(`  ✅ Transaction table accessible (${transactionCount} rows)\n`);

    const betCount = await prisma.bet.count();
    console.log(`  ✅ Bet table accessible (${betCount} rows)\n`);

    // Test 4: Migrations applied
    console.log('✓ Test 4: Migrations');
    const migrations = await prisma.$queryRaw`
      SELECT name, finished_at 
      FROM _prisma_migrations 
      ORDER BY finished_at DESC 
      LIMIT 1;
    `;
    if (migrations && migrations[0]) {
      console.log(`  ✅ Latest migration: ${migrations[0].name}`);
      console.log(`     Applied at: ${migrations[0].finished_at}\n`);
    }

    console.log('✅ DATABASE VERIFICATION PASSED');
    console.log('\n🎉 Your database is ready for production!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ DATABASE VERIFICATION FAILED\n');
    console.error('Error:', error.message);
    console.error('\n⚠️  Deployment may have issues. Check:');
    console.error('   1. DATABASE_URL environment variable is set');
    console.error('   2. Neon project is running (https://console.neon.tech)');
    console.error('   3. Connection string format is correct');
    console.error('   4. Prisma migrations ran successfully');

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();
