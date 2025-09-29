// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { use } from 'passport';
import { UsersService } from 'src/users/users.service';
import { formatResponse } from 'src/utils/response';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async register(email: string, password: string, name: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.usersService.create({ email, password: hashedPassword, name });
    }

    async login(email: string, password: string) {

        const user = await this.usersService.getUserByEmail(email);
        if (!user) throw new UnauthorizedException('Email không tồn tại');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');

        const payload = { sub: user.id, email: user.email };
        console.log({ user });

        return formatResponse({
            access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                roles: user.roles,
                phone: user.phone,
                address: user.address,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }
        }, 'Đăng nhập thành công');
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, { secret: 'MY_SECRET_KEY' });
            const newAccessToken = this.jwtService.sign(
                { sub: payload.sub, email: payload.email },
                { expiresIn: '15m' }
            );
            return { access_token: newAccessToken };
        } catch (e) {
            throw new UnauthorizedException('Refresh token không hợp lệ');
        }
    }

}
