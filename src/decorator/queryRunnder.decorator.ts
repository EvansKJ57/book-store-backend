import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

export const Qr = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const qr: QueryRunner = req.QueryRunner;

  return qr;
});
