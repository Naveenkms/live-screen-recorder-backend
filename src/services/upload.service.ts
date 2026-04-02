import { Upload } from "@aws-sdk/lib-storage";
import { PassThrough } from "stream";
import { s3Client } from "../config/aws";
import { ENV } from "../config/env";
import { VideoController } from "../controllers/video.controller";

export class UploadService {
  private passThroughStream: PassThrough;
  private userId: string;

  constructor(userId: string) {
    this.passThroughStream = new PassThrough();
    this.userId = userId;
  }

  public getStream(): PassThrough {
    return this.passThroughStream;
  }

  public startUpload() {
    const key = `recording-${Date.now()}.webm`;
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: ENV.S3_BUCKET_NAME,
        Key: key,
        Body: this.passThroughStream,
        ContentType: "video/webm",
      },
    });

    upload
      .done()
      .then(async (data: any) => {
        console.log("Upload finished safely!", data.Location);
        try {
          await VideoController.createVideo({
            userId: this.userId,
            title: key,
            url: data.Location,
            key: data.Key || key,
          });
          console.log("Video info saved to DB successfully.");
        } catch (dbErr) {
          console.error("Failed to save video info to DB", dbErr);
        }
      })
      .catch((err: any) => console.error("Upload failed", err));
  }

  public writeData(data: any) {
    this.passThroughStream.write(data);
  }

  public endUpload() {
    this.passThroughStream.end();
  }
}
