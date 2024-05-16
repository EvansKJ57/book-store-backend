declare namespace NodeJS {
  interface ProcessEnv {
    HTTP_PORT: string;
    HTTPS_PORT: string;
    MYSQL_HOST: string;
    MYSQL_USER: string;
    MYSQL_PW: string;
    ORIGIN_URL: string;
    JWT_AC_KEY: string;
    JWT_RF_KEY: string;
    GOOGLE_REDIRECT_URI: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    SSL_KEY: string;
    SSL_CERT: string;
  }
}
