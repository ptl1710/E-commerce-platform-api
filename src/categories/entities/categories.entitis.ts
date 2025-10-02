export class CategoriesEntity {
    id: number;
    name?: string | null;
    description?: string | null;
    createdAt: Date | null;               // luôn có
    updatedAt: Date | null;    // luôn có

    constructor(partial: Partial<CategoriesEntity>) {
        Object.assign(this, partial);
    }
}