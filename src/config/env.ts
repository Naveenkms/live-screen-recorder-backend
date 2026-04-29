import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 8080,
  S3_ENDPOINT: process.env.S3_ENDPOINT as string,
  S3_REGION: process.env.S3_REGION as string,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN as string,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME as string,
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE as string,
  MONGODB_URI: process.env.MONGODB_URI as string,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS as string,
};
