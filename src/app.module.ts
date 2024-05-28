import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModel } from './entities/books.entity';
import { UsersModel } from './entities/users.entity';
import { CategoriesModule } from './categories/categories.module';
import { CategoriesModel } from './entities/categories.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    BooksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'book-store',
      entities: [BooksModel, UsersModel, CategoriesModel],
      synchronize: true, // 자동연동 여부, 프로덕션 환경에서는 false로 한다.
    }),
    CategoriesModule,
  ],

  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
