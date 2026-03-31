import { S3Client } from "@aws-sdk/client-s3";
import { ENV } from "./env";

export const s3Client = new S3Client({
  endpoint: ENV.S3_ENDPOINT,
  region: ENV.S3_REGION,
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
  },
});
