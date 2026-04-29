import { Request, Response } from "express";
import { Video } from "../models/video.model";
import ApiResponse from "../utils/api-response";
import ApiError from "../utils/api-error";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { ENV } from "../config/env";
import { s3Client } from "../config/aws";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const VideoController = {
  async createVideo(data: {
    userId: string;
    title: string;
    url: string;
    key: string;
  }) {
    try {
      const video = new Video(data);
      await video.save();
      return video;
    } catch (error) {
      console.error("Error saving video to DB:", error);
      throw error;
    }
  },

  async getUserVideos(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.auth?.payload.sub;

      const videos = await Video.find({ userId: String(userId) }).sort({
        createdAt: -1,
      });

      const videosWithUrls = await Promise.all(
        videos.map(async (video) => {
          const command = new GetObjectCommand({
            Bucket: ENV.S3_BUCKET_NAME,
            Key: video.key,
          });

          const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
          });

          return {
            _id: video._id,
            title: video.title,
            url: signedUrl,
            thumbnail: video.url,
          };
        }),
      );

      res
        .status(200)
        .json(
          new ApiResponse(200, videosWithUrls, "Videos fetched successfully"),
        );
    } catch (error) {
      console.error("Error fetching user videos:", error);
      throw new ApiError(500, "Error fetching videos");
    }
  },

  async downloadVideo(req: Request, res: Response): Promise<void> {
    try {
      const { videoId } = req.params;
      const video = await Video.findById(videoId);

      if (!video) {
        throw new ApiError(404, "Video not found");
      }

      const command = new GetObjectCommand({
        Bucket: ENV.S3_BUCKET_NAME,
        Key: video.key,
        ResponseContentDisposition: `attachment; filename="${video.title}"`,
      });

      const downloadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { downloadUrl },
            "Video downloaded successfully",
          ),
        );
    } catch (error) {
      console.error("Error downloading video:", error);
      throw new ApiError(500, "Error downloading video");
    }
  },

  async getSignedUrl(req: Request, res: Response): Promise<void> {
    try {
      const { videoId } = req.params;
      const video = await Video.findById(videoId);

      if (!video) {
        throw new ApiError(404, "Video not found");
      }

      const command = new GetObjectCommand({
        Bucket: ENV.S3_BUCKET_NAME,
        Key: video.key,
      });

      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 36,
      });

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { signedUrl },
            "Signed URL fetched successfully",
          ),
        );
    } catch (error) {
      console.error("Error fetching signed URL:", error);
      throw new ApiError(500, "Error fetching signed URL");
    }
  },
};
