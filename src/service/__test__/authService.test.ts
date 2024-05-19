import TokensModel from '../../models/tokensModel';
import UsersModel from '../../models/usersModel';
import AuthService from '../authService';
import ServiceMockData from './service.mock.data';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import {
  issueAccessToken,
  issueRefreshToken,
} from '../../util/token/issueToken';
import CustomError from '../../util/CustomError';

jest.mock('crypto');
jest.mock('../../util/token/issueToken');
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid'),
}));

describe('AuthService Test', () => {
  const { foundLocalUser: mockLocalUser, foundSnsUser: mockSnsUser } =
    ServiceMockData;

  describe('loginUser test', () => {
    let spyFoundModelByEmail: jest.SpyInstance;
    let spyTokenModel: jest.SpyInstance;

    const mockAcToken = issueAccessToken({ userId: mockLocalUser.id });
    const mockRfToken = issueRefreshToken({
      userId: mockLocalUser.id,
      uuid: uuidv4(),
    });
    beforeEach(() => {
      spyFoundModelByEmail = jest.spyOn(UsersModel, 'findUserByEmail');
      spyTokenModel = jest.spyOn(TokensModel, 'updateToken');
      spyFoundModelByEmail.mockResolvedValueOnce(mockLocalUser);
      spyTokenModel.mockReturnValueOnce(1);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('provider가 local인 경우 비밀번호 확인 후 유저, 엑세스토큰, 리프레쉬 토큰을 배열형태로 리턴해야한다', async () => {
      crypto.pbkdf2Sync = jest.fn().mockReturnValueOnce('hashedPw');
      const result = await AuthService.loginUser({
        email: mockLocalUser.email,
        password: 'somethingPw',
        provider: 'LOCAL',
      });
      expect(result).toStrictEqual([mockLocalUser, mockAcToken, mockRfToken]);
      expect(spyFoundModelByEmail).toHaveBeenCalledTimes(1);
      expect(spyTokenModel).toHaveBeenCalledTimes(1);
    });
    it('비밀 번호가 다른 경우 이메일 혹은 비밀번호가 다름(401)에러를 던져야 한다.', async () => {
      crypto.pbkdf2Sync = jest.fn().mockReturnValueOnce('wrongHashedPw');
      const customError = new CustomError('이메일 혹은 비밀번호가 다름', 401);
      await expect(
        AuthService.loginUser({
          email: mockLocalUser.email,
          password: 'wrongPW',
          provider: 'LOCAL',
        })
      ).rejects.toStrictEqual(customError);
    });
  });
});
