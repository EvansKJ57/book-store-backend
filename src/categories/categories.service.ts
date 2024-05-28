import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesModel } from 'src/entities/categories.entity';
import { mockCategoryData } from 'src/entities/mock-data/mockCategory';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesModel)
    private readonly categoryRepository: Repository<CategoriesModel>,
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
