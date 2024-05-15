import { IDelivery } from './customTypes';

export interface IBookOptionQuery {
  categoryId?: number;
  newBooks?: boolean;
  pageSize?: number;
  curPage?: number;
}

export interface ILoginUserReqBody {
  email: string;
  password: string;
}

export interface ICreateUserReqBody extends ILoginUserReqBody {
  name: string;
}

export interface IOrderReqBody {
  carts: number[];
  delivery: IDelivery;
}
