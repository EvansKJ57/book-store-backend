const { StatusCodes } = require('http-status-codes');

const CategoryService = require('../service/categoryService');
const getAllCategory = async (req, res, next) => {
  try {
    const data = CategoryService.getCategories();
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    next(error);
  }
};
module.exports = { getAllCategory };
