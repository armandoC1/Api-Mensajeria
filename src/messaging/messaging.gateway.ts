import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private connectedUsers: { [userId: string]: string } = {};

  handleConnection(client: Socket) {
    console.log('New connection:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);

    for (const userId in this.connectedUsers) {
      if (this.connectedUsers[userId] === client.id) {
        delete this.connectedUsers[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  @SubscribeMessage('registerUser')
  handleRegisterUser(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    if (this.connectedUsers[userId]) {
      console.log(`User ${userId} was already connected. Updating socket ID.`);
    }
    this.connectedUsers[userId] = client.id;
    console.log(`User ${userId} connected with socket ID ${client.id}`);

    client.emit('registered', { message: `User ${userId} registered successfully` });
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(
    @MessageBody() payload: { senderId: string; recipientId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const recipientSocketId = this.connectedUsers[payload.recipientId];

    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('message', {
        sender: payload.senderId,
        message: payload.message,
      });
      // console.log(`Message from ${payload.senderId} to ${payload.recipientId}: ${payload.message}`);
    } else {

      client.emit('error', { message: 'Recipient not connected' });
      // console.log(`Recipient ${payload.recipientId} not connected`);
    }
  }
}
