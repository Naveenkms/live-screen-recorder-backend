import { Router } from "express";
import { VideoController } from "../controllers/video.controller";

const router = Router();

// Endpoint to fetch recordings. Provide userId as query param or route param
router.get("/user/:userId", VideoController.getUserVideos);

export default router;
