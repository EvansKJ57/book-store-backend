import { StatusCodes } from 'http-status-codes';
import CustomError from '../../util/CustomError';
import CategoryModel from '../../models/categoryModel';
import CategoryService from '../categoryService';

describe('CategoryService getCategories test', () => {
  let spyCategoryModel: jest.SpyInstance;
  beforeEach(() => {
    spyCategoryModel = jest.spyOn(CategoryModel, 'getCategories');
  });

  afterEach(() => {
    spyCategoryModel.mockRestore();
  });
  it('should return a list of categories', async () => {
    const mockCategories: any = [
      { category_id: 1, category_name: 'novel' },
      { category_id: 2, category_name: 'essay' },
    ];

    spyCategoryModel.mockResolvedValueOnce(mockCategories);

    const result = await CategoryService.getCategories();

    expect(result).toStrictEqual([
      { categoryId: 1, categoryName: 'novel' },
      { categoryId: 2, categoryName: 'essay' },
    ]);
    expect(spyCategoryModel).toHaveBeenCalledTimes(1);
  });

  it('해당 카테고리가 없다면 해당 카테고리 없음(404)에러를 던져야함', async () => {
    const customError = new CustomError(
      '해당 카테고리 없음',
      StatusCodes.NOT_FOUND
    );
    spyCategoryModel.mockImplementationOnce(() => []);

    await expect(CategoryService.getCategories()).rejects.toThrow(customError);
  });

  it('BooksModel이 에러가 나면 sql에러(500)를 던져야함', async () => {
    const sqlError = new CustomError('SQL error', StatusCodes.BAD_REQUEST);

    spyCategoryModel.mockRejectedValueOnce(sqlError);

    await expect(CategoryService.getCategories()).rejects.toThrow(sqlError);
  });
});
