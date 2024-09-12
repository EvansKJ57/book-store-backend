import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from '../service/categories.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('category')
@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAll() {
    return this.categoriesService.getCategories();
  }

  @Get(':id')
  getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getCategory(id);
  }
}
