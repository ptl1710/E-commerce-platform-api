import { Controller, Get, Post, Body, Param, Delete, BadGatewayException, Put, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from 'src/interface/InterfaceResponse';
import { UserEntity } from './entities/user.entity';
import { formatResponse } from 'src/utils/response';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<UserEntity>> {
        const user = await this.usersService.create(createUserDto);
        return formatResponse(user, 'User created successfully');
    }

    @Get()
    async findAll(): Promise<ApiResponse<UserEntity[]>> {
        const list = await this.usersService.findAll();
        return formatResponse(list, 'Get list successfully');
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findOne(parseInt(id));
        return formatResponse(user, 'Get detail successfully');
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<ApiResponse<UserEntity>> {
        const res = await this.usersService.update(parseInt(id), updateUserDto);
        return formatResponse(res, 'Update user successfully');
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const deleteUser = await this.usersService.findOne(+id);
        if (!deleteUser) {
            throw new BadGatewayException('User not found');
        }
        const res = await this.usersService.remove(+id);
        return formatResponse(res, 'Delete user successfully');
    }
}
