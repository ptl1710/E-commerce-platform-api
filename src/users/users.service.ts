import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { formatResponse } from "src/utils/response";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(user: { email: string; password: string; name: string }) {
        if (!user.email || !user.password || !user.name) {
            throw new BadRequestException('Thiếu thông tin bắt buộc: email, password, name');
        }
        if (user.password.length < 6) {
            throw new BadRequestException('Mật khẩu phải có ít nhất 6 ký tự');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            throw new BadRequestException('Email không hợp lệ');
        }
        if (await this.prisma.user.findUnique({ where: { email: user.email } })) {
            throw new BadRequestException('Email đã được sử dụng');
        }

        const newUser = await this.prisma.user.create({
            data: {
                ...user,
                password: await bcrypt.hash(user.password, 10),
                createdAt: new Date(),
            },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                roles: true,
                phone: true,
                address: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        return formatResponse(newUser, 'User created successfully');
    }

    async getAllUsers() {
        const listUsers = await this.prisma.user.findMany({
            where: { deleted: false },
            select: {
                id: true,
                email: true,
                name: true,
                // password: true,
                roles: true,
                phone: true,
                address: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        return formatResponse(listUsers, 'Lấy danh sách user thành công');
    }

    async getDetailUser(id?: number) {
        if (!id) {
            throw new BadRequestException('Id là bắt buộc');
        }
        let where: any = {};
        if (id) where.id = parseInt(id.toString());

        const detailUser = await this.prisma.user.findFirst({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                // password: true,
                roles: true,
                phone: true,
                address: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!detailUser) {
            throw new BadRequestException('Không tìm thấy user');
        }

        return formatResponse(detailUser, 'Lấy chi tiết user thành công');
    }

    async getUserByEmail(email: string) {
        if (!email) {
            throw new Error('Email là bắt buộc');
        }
        return this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                roles: true,
                phone: true,
                address: true,
                createdAt: true,
                updatedAt: true,
            }
        })
    }

    async deleteUser(id?: number) {
        if (!id) {
            throw new Error('Id là bắt buộc');
        }
        let where: any = {};
        if (id) where.id = id;
        const user = await this.prisma.user.update({
            where: { id },
            data: { deleted: true, updatedAt: new Date() },
        });

        return formatResponse(user, 'Xoá user thành công');
    }
}