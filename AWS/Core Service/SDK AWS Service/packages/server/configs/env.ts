import dotenv from "dotenv";
dotenv.config();

import { normalizePort, getOsEnv, toNumber } from "../libs/os";

const env = {
  node: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  isDevelopment: process.env.NODE_ENV === "development",
  apiUrl: process.env.API_URL,
  origin: process.env.ORIGIN,
  whiteLists: process.env.WHITE_LISTS,
  app: {
    ipServer: process.env.HOSTIP,
    port: process.env.PORT,
  },
  redisPort: process.env.REDIS_PORT,
  awsConfigKey : process.env.AWS_CONFIG_KEY
};

export default env;
