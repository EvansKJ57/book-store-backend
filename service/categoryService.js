const { StatusCodes } = require('http-status-codes');
const CustomError = require('../util/CustomError');
const CategoryModel = require('../models/categoryModel');

const getCategories = async () => {
  try {
    const results = await CategoryModel.getCategories();
    if (results.length === 0) {
      throw new CustomError('해당 카테고리 없음', StatusCodes.NOT_FOUND);
    }
    const data = results.map((category) => {
      const memo = {
        categoryId: category.category_id,
        categoryName: category.category_name,
      };
      return memo;
    });
    return data;
  } catch (error) {
    if (!error.statusCode) {
      throw new CustomError(
        'sql 오류',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
    throw error;
  }
};

module.exports = { getCategories };
