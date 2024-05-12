import { JwtPayload } from 'jsonwebtoken';

export interface LoginUser {
  email: string;
  name: string;
  pw: string;
  salt?: string;
  provider?: string;
  provider_userId?: string | null;
}

export interface FoundUser {
  id: number;
  email: string;
  name: string;
  password: string;
  salt: string;
  provider: string;
  provider_userId?: string | null;
}

export interface CustomJwtPayload extends JwtPayload {
  userId: number;
}

export interface GoogleIdTokenPayload extends JwtPayload {
  email: string;
  name: string;
}

export interface GetBooksParamsType {
  categoryId?: number;
  newBooks?: boolean;
  pageSize?: number;
  curPage?: number;
}

export interface Delivery {
  address: string;
  receiver: string;
  contact: string;
}

export interface BookDataType {
  id: number;
  title: string;
  price: number;
  author: string;
  qty: number;
}

export interface BookDetailData {
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

export interface OrderResData {
  [key: string]: {
    orderId: number;
    address: string;
    createdAt: string;
    receiver: string;
    totalPrice: number;
    totalQty: number;
    orderedBooks: BookDataType[];
  };
}
