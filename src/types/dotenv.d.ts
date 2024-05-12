declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    MYSQL_HOST: string;
    MYSQL_USER: string;
    MYSQL_PW: string;
    ORIGIN_URL: string;
    JWT_AC_KEY: string;
    JWT_RF_KEY: string;
    GOOGLE_REDIRECT_URI: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
  }
}
