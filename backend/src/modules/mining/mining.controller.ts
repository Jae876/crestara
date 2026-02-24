import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { MiningService } from './mining.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MiningBotPurchaseSchema } from '@crestara/shared';

@Controller('mining')
export class MiningController {
  constructor(private miningService: MiningService) {}

  @Get('packages')
  async getPackages() {
    return this.miningService.getMiningPackages();
  }

  @Post('bot/purchase')
  @UseGuards(JwtAuthGuard)
  async purchaseBot(@CurrentUser() user: any, @Body() body: any) {
    const validated = MiningBotPurchaseSchema.parse(body);
    return this.miningService.purchaseBot(user.id, validated.packageType, validated.coin);
  }

  @Get('bots')
  @UseGuards(JwtAuthGuard)
  async getUserBots(@CurrentUser() user: any) {
    return this.miningService.getUserBots(user.id);
  }
}
