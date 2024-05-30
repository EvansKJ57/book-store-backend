import { Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from '../service/categories.service';

@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /** 초기 목 데이터 저장 */
  @Post()
  insertMockData() {
    return this.categoriesService.insertMock();
  }

  @Get()
  getAll() {
    return this.categoriesService.getAll();
  }
}
