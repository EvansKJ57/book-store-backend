import { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';

export interface ILoginUser {
  email: string;
  name: string;
  password: string;
  salt?: string;
  provider?: string;
  provider_userId?: string | null;
}

export interface IFoundUser extends ILoginUser, RowDataPacket {
  id: number;
  salt: string;
  provider: string;
  provider_userId: string;
}

export interface ICustomJwtPayload extends jwt.JwtPayload {
  userId: number;
}

export interface IGoogleIdTokenPayload extends jwt.JwtPayload {
  email: string;
  name: string;
}

export interface IGetAllBookOptions {
  categoryId?: number;
  newBooks?: boolean;
  pageSize?: number;
  curPage?: number;
}

export interface IDelivery {
  address: string;
  receiver: string;
  contact: string;
}

export interface IBookDetailData extends RowDataPacket {
  id: number;
  title: string;
  img: number;
  form: string;
  isbn: number;
  summary: string;
  detail: string;
  author: string;
  pages: number;
  contents: string;
  price: number;
  pub_date: string;
  likes: number;
  liked: number;
  categoryId: number;
  categoryName: string;
  category_id?: number;
  category_name?: string;
}

export type TBookDataType = {
  id: number;
  title: string;
  price: number;
  author: string;
  qty: number;
};

export interface IOrderQueryData extends RowDataPacket {
  orderId: number;
  address: string;
  createdAt: string;
  receiver: string;
  totalPrice: number;
  totalQty: number;
  orderedBooks: TBookDataType[];
}

export interface IOrderResData {
  [key: string]: {
    orderId: number;
    address: string;
    createdAt: string;
    receiver: string;
    totalPrice: number;
    totalQty: number;
    orderedBooks: TBookDataType[];
  };
}
