import dotenv from "dotenv";
dotenv.config();

import { WebSocketServer } from "ws";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { PassThrough } from "stream";

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT as string, 
  region: process.env.S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const wss = new WebSocketServer({ port: Number(process.env.PORT) || 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected. Starting stream...");

  // 1. Create a PassThrough stream. This acts as a pipe.
  const passThroughStream = new PassThrough();

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: `recording-${Date.now()}.webm`, 
      Body: passThroughStream,
      ContentType: "video/webm",
    },
  });

  upload
    .done()
    .then((data) => console.log("Upload finished safely!", data.Location))
    .catch((err) => console.error("Upload failed", err));
  ws.on("message", (message) => {
    // Write the incoming video data directly into the stream pipe
    passThroughStream.write(message);
  });

  //  THE CRASH HANDLER: If the user's PC crashes or disconnects
  ws.on("close", () => {
    console.log("Client disconnected or crashed.");
    // Closing the stream tells the AWS SDK that the video is done.
    // It will take whatever is left in the buffer (< 5MB) and finalize the video!
    passThroughStream.end();
  });
});
