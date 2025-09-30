import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.roles };

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
    await this.usersService.updateRefreshToken(user.id, hashedRefresh);

    return { accessToken, refreshToken };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user);
    return { message: 'Đăng ký thành công', user, ...tokens };
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
    return { message: 'Đăng nhập thành công', user, ...tokens };
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Không có quyền');

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) throw new ForbiddenException('Refresh token không hợp lệ');

    return this.generateTokens(user);
  }
}
