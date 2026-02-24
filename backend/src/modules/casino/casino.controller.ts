import { Controller, Get, Post, UseGuards, Body, Param } from '@nestjs/common';
import { CasinoService } from './casino.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { PlaceBetSchema } from '@crestara/shared';

@Controller('casino')
export class CasinoController {
  constructor(private casinoService: CasinoService) {}

  @Get('games')
  async getGames() {
    return this.casinoService.getAvailableGames();
  }

  @Post('bet/place')
  @UseGuards(JwtAuthGuard)
  async placeBet(@CurrentUser() user: any, @Body() body: any) {
    const validated = PlaceBetSchema.parse(body);
    return this.casinoService.placeBet(user.id, validated.gameType, validated.betAmount, body.clientSeed);
  }

  @Get('bets')
  @UseGuards(JwtAuthGuard)
  async getUserBets(@CurrentUser() user: any) {
    return this.casinoService.getUserBets(user.id);
  }

  @Get('verify/:betId')
  async verifyProvenFair(@Param('betId') betId: string) {
    return this.casinoService.verifyProvenFair(betId);
  }
}
