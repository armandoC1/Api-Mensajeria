import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { MessagingGateway } from './messaging/messaging.gateway';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [    
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'user123$',
      database: process.env.DB_NAME || 'mensajesBd',
      entities: [User],
      // synchronize: true, // Deshabilita esto en producción
    }),
 
    AuthModule,  
    UsersModule, 
  ],

  providers: [
    MessagingGateway, 
  ],
})
export class AppModule {}
