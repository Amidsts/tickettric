import "dotenv/config";

const { env } = process;

const appConfig = {
  databaseUrl: env.DATABASE_URL || "",
  jwtKey: env.JWT_KEY,
  port: env.PORT,
};

export default appConfig;
