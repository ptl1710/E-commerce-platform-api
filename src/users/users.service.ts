import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const user = await this.prisma.user.create({
            data: {
                ...createUserDto,
                password: bcrypt.hashSync(createUserDto.password, 10),
            },
        });
        return new UserEntity(user);
    }

    async findAll(): Promise<UserEntity[]> {
        const users = await this.prisma.user.findMany();
        return users.map((u: any) => new UserEntity(u));
    }

    async findOne(id: number): Promise<UserEntity> {
        const user = await this.prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        return new UserEntity(user);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        if (!id) throw new BadRequestException('Id is required');

        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...updateUserDto,
                updatedAt: new Date(),
            },
        });
        return new UserEntity(user);
    }

    async remove(id: number): Promise<UserEntity> {
        const user = await this.prisma.user.update({
            where: { id },
            data: { deleted: true },
        });
        return new UserEntity(user);
    }

    async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                roles: true,
                refreshToken: true
            }
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        return user;
    }
}
