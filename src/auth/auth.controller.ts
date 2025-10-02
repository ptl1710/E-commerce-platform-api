import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../Dto/Auth/register.dto';
import { LoginDto } from '../Dto/Auth/login.dto';
import { ApiResponse, AuthResponse } from 'src/interface/InterfaceResponse';
import { formatResponse } from 'src/utils/response';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<ApiResponse<AuthResponse>> {
    const { user, ...tokens } = await this.authService.register(registerDto);
    return formatResponse({ user: new UserEntity(user), ...tokens }, 'Đăng ký thành công');
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<AuthResponse>> {
    const { user, ...tokens } = await this.authService.login(loginDto);
    return formatResponse({ user: new UserEntity(user), ...tokens }, 'Đăng nhập thành công');
  }

  @Post('refresh')
  async refresh(
    @Body('userId') userId: number,
    @Body('refreshToken') refreshToken: string,
  ): Promise<ApiResponse<AuthResponse>> {
    const { user, ...tokens } = await this.authService.refresh(userId, refreshToken);
    return formatResponse({ user, ...tokens }, 'Làm mới token thành công');
  }
}
