import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from '../Dto/Auth/register.dto';
import { LoginDto } from '../Dto/Auth/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'secretKey',
      expiresIn: '15m', // access token ngắn hạn
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refreshSecret',
      expiresIn: '7d', // refresh token dài hạn
    });

    // Lưu refresh token (hash để bảo mật hơn)
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(user.id, { refreshToken: hashedRefresh });

    return { accessToken, refreshToken };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email đã tồn tại');
    }

    const user = await this.prisma.user.create({
      data: {
        ...registerDto,
        password: hashedPassword,
      },
    });

    const tokens = await this.generateTokens(user);
    return { user, ...tokens };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException('Email không tồn tại');

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      (user as any).password,
    );
    if (!isPasswordValid) throw new UnauthorizedException('Sai mật khẩu');

    const tokens = await this.generateTokens(user);
    return { user, ...tokens };
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Không có quyền');

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) throw new ForbiddenException('Refresh token không hợp lệ');

    const tokens = await this.generateTokens(user);
    return { user, ...tokens };
  }
}
