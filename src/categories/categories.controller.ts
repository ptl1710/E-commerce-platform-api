import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiResponse } from "src/interface/InterfaceResponse";
import { CategoriesEntity } from "./entities/categories.entitis";
import { CategoriesService } from "./categories.service";
import { formatResponse } from "src/utils/response";
import { CreateCategoriesDto } from "src/Dto/Categories/create-categories.dto";
import { UpdateCategoriesDto } from "src/Dto/Categories/update-categories.dto";

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
    async getDetail(@Param('id') id: string): Promise<ApiResponse<CategoriesEntity>> {
        const category = await this.categoriesService.findOne(parseInt(id));
        return formatResponse(category, 'Get detail successfully');
    }

    @Post()
    async create(@Body() createDto: CreateCategoriesDto): Promise<ApiResponse<CategoriesEntity>> {
        const category = await this.categoriesService.create(createDto);
        return formatResponse(category, 'Create category successfully');
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateDto: UpdateCategoriesDto
    ): Promise<ApiResponse<CategoriesEntity>> {
        const category = await this.categoriesService.update(parseInt(id), updateDto);
        return formatResponse(category, 'Update category successfully');
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<ApiResponse<CategoriesEntity>> {
        const category = await this.categoriesService.remove(parseInt(id));
        return formatResponse(category, 'Delete category successfully');
    }
}