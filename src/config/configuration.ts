export default () => ({
  frontUrl: process.env.FRONT_BASE_URL,
  port: Number(process.env.PORT) || 3000,
  bcrypt: {
    round: Number(process.env.HASH_ROUND),
  },
  jwt: {
    refresh: process.env.JWT_RF_KEY,
    refresh_time: Number(process.env.JWT_RF_TIME),
    access: process.env.JWT_AC_KEY,
    access_time: process.env.JWT_AC_TIME,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientPw: process.env.GOOGLE_CLIENT_SECRET,
    redirect: process.env.GOOGLE_REDIRECT_URI,
  },
});
