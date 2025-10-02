import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // 👈 import UsersModule
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    UsersModule, // 👈 thêm vào imports
    JwtModule.register({
      secret: 'MY_SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
    PrismaModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
