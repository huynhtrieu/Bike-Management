require("dotenv").config();

const getConfig = () => ({
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  EXPIRE_TOKEN: process.env.EXPIRE_TOKEN,
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  BUCKET_NAME: process.env.BUCKET_NAME,
  BIKE_FE_ENDPOINT: process.env.BIKE_FE_ENDPOINT,
});

const config = getConfig();

module.exports = config;
