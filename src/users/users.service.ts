import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        const user = await this.prisma.user.create({
            data: {
                ...createUserDto,
            },
        });
        return new UserEntity(user);
    }

    async findAll(): Promise<UserEntity[]> {
        const users = await this.prisma.user.findMany();
        return users.map((u) => new UserEntity(u));
    }

    async findOne(id: number): Promise<UserEntity> {
        const user = await this.prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw new Error('User not found');
        }

        return new UserEntity(user);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        const user = await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
        return new UserEntity(user);
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: refreshToken },
        });
    }

    async remove(id: number): Promise<UserEntity> {
        const user = await this.prisma.user.update({
            where: { id },
            data: { deleted: true },
        });
        return new UserEntity(user);
    }

    async findByEmail(email: string): Promise<UserEntity> {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new Error('User not found');
        }

        return new UserEntity(user);
    }
}
