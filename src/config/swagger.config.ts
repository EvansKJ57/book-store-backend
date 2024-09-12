import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Books store api')
  .setDescription('books-store-api')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'Bearer',
      in: 'header',
    },
    'access-token',
  )
  .build();
