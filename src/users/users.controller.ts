import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('get-all')
    getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Get('get-detail')
    getUserById(@Query('id') id?: number) {
        return this.usersService.getDetailUser(id);
    }

    @Post('create')
    createUser(@Body() body: { email: string; password: string; name: string }) {
        return this.usersService.create(body);
    }

    @Delete('delete')
    deleteUser(@Query('id') id?: number) {
        return this.usersService.deleteUser(id);
    }

}