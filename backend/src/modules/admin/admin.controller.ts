import { Controller, Get, Post, Put, UseGuards, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@crestara/shared';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('overview')
  async getOverview(@CurrentUser() user: any) {
    return this.adminService.getOverview(user.id, user.role);
  }

  @Get('users')
  async listUsers(@CurrentUser() user: any) {
    return this.adminService.listUsers(user.role);
  }

  @Get('users/:userId')
  async getUserDetails(@CurrentUser() user: any, @Param('userId') userId: string) {
    return this.adminService.getUserDetails(user.role, userId);
  }

  @Put('users/:userId/balance')
  async updateUserBalance(
    @CurrentUser() user: any,
    @Param('userId') userId: string,
    @Body() body: { newBalance: number; note?: string },
  ) {
    return this.adminService.updateUserBalance(user.role, userId, body.newBalance, body.note);
  }

  @Post('users/:userId/ban')
  async banUser(
    @CurrentUser() user: any,
    @Param('userId') userId: string,
    @Body() body: { reason: string },
  ) {
    return this.adminService.banUser(user.role, userId, body.reason);
  }

  @Get('transactions')
  async listTransactions(@CurrentUser() user: any) {
    return this.adminService.listTransactions(user.role);
  }

  @Post('transactions/:txId/approve')
  async approveTransaction(@CurrentUser() user: any, @Param('txId') txId: string) {
    return this.adminService.approveTransaction(user.role, txId);
  }

  @Post('transactions/:txId/reject')
  async rejectTransaction(@CurrentUser() user: any, @Param('txId') txId: string) {
    return this.adminService.rejectTransaction(user.role, txId);
  }

  @Put('games/:gameType')
  async updateGameConfig(
    @CurrentUser() user: any,
    @Param('gameType') gameType: string,
    @Body() body: { houseEdge: number },
  ) {
    return this.adminService.updateGameConfig(user.role, gameType, body.houseEdge);
  }
}
