import { Controller, Get, Param, Post, ParseIntPipe } from '@nestjs/common';
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
    return this.categoriesService.getCategories();
  }

  @Get(':id')
  getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getCategory(id);
  }
}
