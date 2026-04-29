import { Router } from "express";
import { VideoController } from "../controllers/video.controller";
import checkJwt from "../middlewares/check-jwt.middleware";

const router: Router = Router();

router.get("/", checkJwt, VideoController.getUserVideos);
router.get("/download/:videoId", checkJwt, VideoController.downloadVideo);
router.get("/signed-url/:videoId", checkJwt, VideoController.getSignedUrl);

export default router;
