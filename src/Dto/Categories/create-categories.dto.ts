import { IsOptional, IsString } from 'class-validator';

export class CreateCategoriesDto {
    @IsOptional()
    @IsString()
    name: string;


    @IsOptional()
    @IsString()
    imageIcon: string;

    @IsOptional()
    @IsString()
    description: string;
}
