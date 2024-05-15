import { body, query, param } from 'express-validator';

const userValidatorConfig = {
  email: body('email', '이메일 확인해주세요')
    .trim()
    .notEmpty()
    .isEmail()
    .normalizeEmail(),
  name: body('name', '이름 확인해주세요')
    .trim()
    .notEmpty()
    .isLength({ min: 4 }),
  password: body('password', '비밀번호 확인해주세요')
    .trim()
    .notEmpty()
    .isString(),
};

const bookIdParamsCheck = [param('bookId').isNumeric()];

const cartIdParamsCheck = [param('cartId').isNumeric()];

const bookQueryCheck = [
  query('categoryId').optional().isInt(),
  query('newBooks').optional().isBoolean().toBoolean(),
  query('curPage').optional().isInt(),
  query('pageSize').optional().isInt(),
];

const deliveryBodyCheck = [
  body('delivery.address', '주소 확인해주세요').notEmpty(),
  body('delivery.receiver', '수령인 확인해주세요').notEmpty(),
  body('delivery.contact', '번호 확인해주세요')
    .notEmpty()
    .isMobilePhone('ko-KR'),
];

export {
  userValidatorConfig,
  bookIdParamsCheck,
  cartIdParamsCheck,
  bookQueryCheck,
  deliveryBodyCheck,
};
