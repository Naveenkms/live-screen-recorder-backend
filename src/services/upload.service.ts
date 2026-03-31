import { Upload } from "@aws-sdk/lib-storage";
import { PassThrough } from "stream";
import { s3Client } from "../config/aws";
import { ENV } from "../config/env";

export class UploadService {
  private passThroughStream: PassThrough;

  constructor() {
    this.passThroughStream = new PassThrough();
  }

  public getStream(): PassThrough {
    return this.passThroughStream;
  }

  public startUpload() {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: ENV.S3_BUCKET_NAME,
        Key: `recording-${Date.now()}.webm`,
        Body: this.passThroughStream,
        ContentType: "video/webm",
      },
    });

    upload
      .done()
      .then((data: any) =>
        console.log("Upload finished safely!", data.Location),
      )
      .catch((err: any) => console.error("Upload failed", err));
  }

  public writeData(data: any) {
    this.passThroughStream.write(data);
  }

  public endUpload() {
    this.passThroughStream.end();
  }
}
