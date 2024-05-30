export default () => ({
  port: Number(process.env.PORT) || 3000,
  bcrypt: {
    round: Number(process.env.HASH_ROUND),
  },
  jwt: {
    refresh: process.env.JWT_RF_KEY,
    refresh_time: process.env.JWT_RF_TIME,
    access: process.env.JWT_AC_KEY,
    access_time: process.env.JWT_AC_TIME,
  },
});
