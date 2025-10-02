import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CategoriesEntity } from "./entities/categories.entitis";
import { CreateCategoriesDto } from "src/Dto/Categories/create-categories.dto";

@Injectable()
export class CategoriesService {
    constructor(
        private prisma: PrismaService
    ) { }

    async findAll(): Promise<CategoriesEntity[]> {
        const categoriesList = await this.prisma.categories.findMany({
            where: { deleted: false }
        });

        return categoriesList.map((u: any) => new CategoriesEntity(u));
    }

    async findOne(id: number): Promise<CategoriesEntity> {
        const category = await this.prisma.categories.findUnique({
            where: {
                id,
                deleted: false
            }
        });

        if (!category) {
            throw new BadRequestException('Category not found');
        }
        return new CategoriesEntity(category);
    }

    async create(createDto: CreateCategoriesDto): Promise<CategoriesEntity> {
        const category = await this.prisma.categories.create({
            data: {
                ...createDto
            }
        });
        return new CategoriesEntity(category);
    }

    async update(updateDto: CreateCategoriesDto, id: number): Promise<CategoriesEntity> {
        if (!id) throw new BadRequestException('Id is required');
        const category = await this.prisma.categories.update({
            where: { id },
            data: {
                ...updateDto
            }
        });
        return new CategoriesEntity(category);
    }

    async remove(id: number): Promise<CategoriesEntity> {
        if (!id) throw new BadRequestException('Id is required');
        const category = await this.prisma.categories.update({
            where: { id },
            data: { deleted: true }
        });
        return new CategoriesEntity(category);
    }


}