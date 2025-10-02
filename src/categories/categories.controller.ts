import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { ApiResponse } from "src/interface/InterfaceResponse";
import { CategoriesEntity } from "./entities/categories.entitis";
import { CategoriesService } from "./categories.service";
import { formatResponse } from "src/utils/response";

@Controller('categories')
export class CategoriesController {
    constructor(
        private categoriesService: CategoriesService
    ) { }
    @Get()
    async getList(): Promise<ApiResponse<CategoriesEntity[]>> {
        const list = await this.categoriesService.findAll();
        return formatResponse(list, 'Get list successfully');
    }

    @Get(':id')
    async getDetail(@Body('id') id: number): Promise<ApiResponse<CategoriesEntity>> {
        const category = await this.categoriesService.findOne(id);
        return formatResponse(category, 'Get detail successfully');
    }

    @Post()
    async create(@Body() createDto: any): Promise<ApiResponse<CategoriesEntity>> {
        const category = await this.categoriesService.create(createDto);
        return formatResponse(category, 'Create category successfully');
    }

    @Put(':id')
    async update(@Body() updateDto: any): Promise<ApiResponse<CategoriesEntity>> {
        const category = await this.categoriesService.update(updateDto, updateDto.id);
        return formatResponse(category, 'Update category successfully');
    }

    @Delete(':id')
    async remove(@Body('id') id: number): Promise<ApiResponse<CategoriesEntity>> {
        const category = await this.categoriesService.remove(id);
        return formatResponse(category, 'Delete category successfully');
    }
}