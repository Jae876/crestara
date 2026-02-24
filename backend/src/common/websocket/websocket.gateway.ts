import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('notification', {
      message: 'Welcome to Crestara Platform',
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Broadcast bet won event to all connected clients
  broadcastBetWon(data: any) {
    this.server.emit('bet:won', data);
  }

  // Broadcast mining payout
  broadcastMiningPayout(data: any) {
    this.server.emit('mining:payout', data);
  }

  // Broadcast real-time coin prices
  broadcastPriceUpdate(data: any) {
    this.server.emit('price:update', data);
  }

  // Send user-specific notification
  notifyUser(userId: string, data: any) {
    this.server.to(userId).emit('notification', data);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: string) {
    client.join(userId);
    console.log(`User ${userId} joined room`);
  }
}
