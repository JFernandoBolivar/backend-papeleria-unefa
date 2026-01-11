import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategorysService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const categoryData = {
      ...createCategoryDto,
      name: createCategoryDto.name.toUpperCase().trim(),
    };
    return await this.categoryRepo.save(categoryData);
  }

  async findAll() {
    return await this.categoryRepo.find();
  }

  async findByOne(id: number) {
    const OneCategory = await this.findOne(id);
    return OneCategory;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const existCategory = await this.findOne(id);
    const updateCategory = this.categoryRepo.merge(
      existCategory,
      updateCategoryDto,
    );
    const saveCategory = await this.categoryRepo.save(updateCategory);
    return saveCategory;
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
  }

  private async findOne(id: number) {
    const Category = await this.categoryRepo.findOne({
      where: { id },
    });
    if (!Category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return Category;
  }
}
