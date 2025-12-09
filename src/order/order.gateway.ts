import 'dotenv/config';

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: [
      `${process.env.CLIENT_SIDE_DASHBOARD_URI}`,
      `${process.env.CLIENT_SIDE_URI}`,
    ],
  },
})
export class OrderGateway {
  @WebSocketServer()
  server: Server;

  sendOrderNotification(notification: { message: string; theId: string }) {
    this.server.emit('newNotification', notification);
  }
}
