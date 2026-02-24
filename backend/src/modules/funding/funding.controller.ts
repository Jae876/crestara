import { Controller, Get, Post, UseGuards, Body, Param } from '@nestjs/common';
import { FundingService } from './funding.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { DepositInitiateSchema, WithdrawSchema } from '@crestara/shared';

@Controller('funding')
export class FundingController {
  constructor(private fundingService: FundingService) {}

  @Get('coins')
  async getSupportedCoins() {
    return this.fundingService.getSupportedCoins();
  }

  @Post('deposit/initiate')
  @UseGuards(JwtAuthGuard)
  async initiateDeposit(@CurrentUser() user: any, @Body() body: any) {
    const validated = DepositInitiateSchema.parse(body);
    return this.fundingService.initiateDeposit(user.id, validated.coin, validated.amount);
  }

  @Post('deposit/confirm')
  @UseGuards(JwtAuthGuard)
  async confirmDeposit(@Body() body: { transactionId: string; txHash: string }) {
    return this.fundingService.confirmDeposit(body.transactionId, body.txHash);
  }

  @Post('withdraw/initiate')
  @UseGuards(JwtAuthGuard)
  async initiateWithdraw(@CurrentUser() user: any, @Body() body: any) {
    const validated = WithdrawSchema.parse(body);
    return this.fundingService.initiateWithdraw(
      user.id,
      validated.coin,
      validated.amount,
      validated.destinationAddress,
    );
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  async getUserTransactions(@CurrentUser() user: any) {
    return this.fundingService.getUserTransactions(user.id);
  }
}
