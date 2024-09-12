import { Injectable } from '@nestjs/common';
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

  getCategory(id: number) {
    return this.categoryRepository.findOne({
      where: { id },
    });
  }
}
