export default () => ({
  frontUrl: process.env.FRONT_BASE_URL,
  port: process.env.PORT,
  bcrypt: {
    round: process.env.HASH_ROUND,
  },
  jwt: {
    refresh: process.env.JWT_RF_KEY,
    refresh_time: process.env.JWT_RF_TIME,
    access: process.env.JWT_AC_KEY,
    access_time: process.env.JWT_AC_TIME,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientPw: process.env.GOOGLE_CLIENT_SECRET,
    redirect: process.env.GOOGLE_REDIRECT_URI,
  },
  db: {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    pw: process.env.DB_PASSWORD,
  },
});
