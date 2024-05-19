import { StatusCodes } from 'http-status-codes';
import CustomError from '../../util/CustomError';
import TransactionModel from '../../models/transactionModel';
import UserService from '../userService';
import UsersModel from '../../models/usersModel';
import ServiceMockData from './service.mock.data';
describe('UserService Test', () => {
  const mockLocalUser = ServiceMockData.foundLocalUser;
  //--------------------------------------------------
  describe('CreateUser Test', () => {
    let spyCreateUserTrans: jest.SpyInstance;
    beforeEach(() => {
      spyCreateUserTrans = jest.spyOn(TransactionModel, 'createUser');
    });

    afterEach(() => {
      spyCreateUserTrans.mockRestore();
    });
    afterAll(() => {
      jest.clearAllMocks();
    });
    it('유저가 생성되면 해당 유저 아이디(number)가 리턴되어야 한다.', async () => {
      spyCreateUserTrans.mockResolvedValueOnce(10);
      const result = await UserService.createUser({
        email: 'test@test.com',
        name: 'tester',
        password: 'password',
        provider: 'LOCAL',
      } as any);
      expect(result).toBe(10);
    });
    it('mysql오류가 생기면 sql오류(500) 에러를 던져야 한다', async () => {
      const mysqlError = new CustomError(
        '유저 생성 오류',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      spyCreateUserTrans.mockRejectedValueOnce(mysqlError);
      await expect(
        UserService.createUser({
          email: 'test@test.com',
          name: 'tester',
          password: 'password',
          provider: 'LOCAL',
        })
      ).rejects.toThrow(mysqlError);
    });
  });
  //--------------------------------------------------
  describe('findUser Test', () => {
    let spyFindById: jest.SpyInstance;
    let spyFindByEmail: jest.SpyInstance;
    beforeEach(() => {
      spyFindById = jest.spyOn(UsersModel, 'findUserById');
      spyFindByEmail = jest.spyOn(UsersModel, 'findUserByEmail');
    });

    afterEach(() => {
      spyFindById.mockRestore();
      spyFindByEmail.mockRestore();
    });

    it('숫자가 들어오면 id로 유저를 정보를 찾고 유저데이터를 리턴해야한다.', async () => {
      spyFindById.mockResolvedValueOnce(mockLocalUser);
      const result = await UserService.findUser(3);

      expect(result).toStrictEqual(mockLocalUser);
      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindByEmail).toHaveBeenCalledTimes(0);
    });
    it('문자가 들어오면 email로 유저 정보를 찾고 유저데이터를 리턴해야한다.', async () => {
      spyFindByEmail.mockReturnValueOnce(mockLocalUser);
      const result = await UserService.findUser('test@test.com');
      expect(result).toStrictEqual(mockLocalUser);
      expect(spyFindById).toHaveBeenCalledTimes(0);
      expect(spyFindByEmail).toHaveBeenCalledTimes(1);
    });
    it('모델에서 오류 있으면 sql 오류(500) 에러를 던져야 한다.', async () => {
      const customError = new CustomError(
        'sql 오류',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      spyFindById.mockRejectedValueOnce(customError);

      await expect(UserService.findUser(2)).rejects.toThrow(customError);
    });
  });
});
