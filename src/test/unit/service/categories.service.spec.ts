import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryModel } from 'src/entities/category.entity';
import { CategoriesService } from 'src/service/categories.service';

const mockCategoryRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(CategoryModel),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  describe('getCategories', () => {
    it('should be a list of categories', async () => {
      const categories = [
        { id: 1, name: 'novel' },
        { id: 2, name: 'magazine' },
      ];
      jest.spyOn(mockCategoryRepository, 'find').mockResolvedValue(categories);

      const result = await categoriesService.getCategories();

      expect(result).toEqual(categories);
      expect(mockCategoryRepository.find).toHaveBeenCalled();
    });

    it('should be a empty list of categories', async () => {
      jest.spyOn(mockCategoryRepository, 'find').mockResolvedValue([]);

      expect(await categoriesService.getCategories()).toEqual([]);
      expect(mockCategoryRepository.find).toHaveBeenCalled();
    });
  });

  describe('getCategory', () => {
    it('should return one of category', async () => {
      const category = { id: 1, name: 'novel' };
      jest.spyOn(mockCategoryRepository, 'findOne').mockResolvedValue(category);

      const result = await categoriesService.getCategory(1);

      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: category.id },
      });
      expect(result).toEqual(category);
    });
    it('should throw NotFoundException if category does not exist in Database', async () => {
      jest.spyOn(mockCategoryRepository, 'findOne').mockResolvedValue(null);

      expect(categoriesService.getCategory(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
