import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { FundingModule } from './modules/funding/funding.module';
import { MiningModule } from './modules/mining/mining.module';
import { CasinoModule } from './modules/casino/casino.module';
import { AdminModule } from './modules/admin/admin.module';
import { ReferralModule } from './modules/referral/referral.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { WebSocketGateway } from './common/websocket/websocket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    PrismaModule,
    AuthModule,
    FundingModule,
    MiningModule,
    CasinoModule,
    AdminModule,
    ReferralModule,
  ],
  providers: [WebSocketGateway],
})
export class AppModule {}
