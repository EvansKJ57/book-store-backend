import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryModel } from 'src/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryModel)
    private readonly categoryRepository: Repository<CategoryModel>,
  ) {}

  getCategories() {
    return this.categoryRepository.find();
  }

  async getCategory(id: number) {
    const result = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('해당 카테고리가 없음.');
    }
    return result;
  }
}
