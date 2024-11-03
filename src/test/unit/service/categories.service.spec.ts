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
});
