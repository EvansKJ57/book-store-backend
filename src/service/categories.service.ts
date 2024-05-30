import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mockCategoryData } from 'src/entities/mock-data/mockCategory';
import { CategoryModel } from 'src/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryModel)
    private readonly categoryRepository: Repository<CategoryModel>,
  ) {}

  async insertMock() {
    for (let i = 0; i < mockCategoryData.length; i++) {
      await this.categoryRepository.save(mockCategoryData[i]);
    }
    return;
  }

  getAll() {
    return this.categoryRepository.find();
  }
}
