import { envVariables } from "../configs";

const { host, url } = envVariables;

export const dbConfig = {
    host,
    url,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };