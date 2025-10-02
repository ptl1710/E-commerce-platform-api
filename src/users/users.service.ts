import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from '../Dto/User/update-user.dto';
import { UserEntity } from './entities/user.entity';
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll(): Promise<UserEntity[]> {
        const users = await this.prisma.user.findMany({
            where: { deleted: false },
        });
        return users.map((u: any) => new UserEntity(u));
    }

    async findOne(id: number): Promise<UserEntity> {
        const user = await this.prisma.user.findUnique({ where: { id, deleted: false } });

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
                role: true
            }
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        return user;
    }
}
