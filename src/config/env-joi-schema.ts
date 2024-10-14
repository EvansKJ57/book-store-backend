import * as joi from 'joi';

export const envJoiSchema = joi.object({
  NODE_ENV: joi.string().empty('').valid('dev', 'prod').default('dev'),
  PORT: joi.number().empty('').default(3000),
  HASH_ROUND: joi.number().empty('').required(),
  SWAGGER_PW: joi.string().empty('').required(),

  FRONT_BASE_URL: joi.string().required(),

  JWT_RF_KEY: joi.string().empty('').required(),
  JWT_RF_TIME: joi.number().empty('').required(),
  JWT_AC_KEY: joi.string().empty('').required(),
  JWT_AC_TIME: joi.string().empty('').required(),

  DB_HOST: joi.string().empty('').default('localhost'),
  DB_NAME: joi.string().empty('').required(),
  DB_PORT: joi.number().empty('').default(5432),
  DB_USER: joi.string().empty('').required(),
  DB_PASSWORD: joi.string().empty('').required(),

  GOOGLE_REDIRECT_URI: joi.string().empty('').required(),
  GOOGLE_CLIENT_ID: joi.string().empty('').required(),
  GOOGLE_CLIENT_SECRET: joi.string().empty('').required(),

  S3_REGION: joi.string().required(),
  S3_BUCKET_NAME: joi.string().required(),
  S3_ACCESS_ID: joi.string().required(),
  S3_ACCESS_KEY: joi.string().required(),
});
