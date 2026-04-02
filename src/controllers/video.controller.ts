import { Request, Response } from "express";
import { Video } from "../models/video.model";

export const VideoController = {
  // Call this internally from UploadService when upload completes
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

  // HTTP endpoint to fetch user's videos
  async getUserVideos(req: Request, res: Response): Promise<void> {
    try {
      // Assuming userId is passed either in req.user from an auth middleware or from params/query
      // For now we'll take it from a route param or query
      const userId = req.params.userId || req.query.userId;

      if (!userId) {
        res.status(400).json({ error: "userId is required" });
        return;
      }

      const videos = await Video.find({ userId: String(userId) }).sort({
        createdAt: -1,
      });
      res.status(200).json({ success: true, videos });
    } catch (error) {
      console.error("Error fetching user videos:", error);
      res
        .status(500)
        .json({ success: false, error: "Server error fetching videos" });
    }
  },
};
