import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('referral')
export class ReferralController {
  constructor(private referralService: ReferralService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getReferralStats(@CurrentUser() user: any) {
    return this.referralService.getReferralStats(user.id);
  }

  @Post('track')
  @UseGuards(JwtAuthGuard)
  async trackReferral(@CurrentUser() user: any, @Body() body: { referralCode: string }) {
    return this.referralService.trackReferral(body.referralCode, user.id);
  }

  @Post('credit')
  async creditReferralBonus(@Body() body: { referredUserId: string }) {
    return this.referralService.creditReferralBonus(body.referredUserId);
  }
}
