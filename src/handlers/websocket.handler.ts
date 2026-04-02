import { IncomingMessage } from "http";
import { CustomWebSocket } from "../types";
import { verifyToken } from "../services/auth.service";
import { UploadService } from "../services/upload.service";

export const handleWebSocketConnection = async (
  ws: CustomWebSocket,
  req: IncomingMessage,
) => {
  const urlParams = new URLSearchParams(req?.url?.split("?")[1]);
  const token = urlParams.get("token");

  if (!token) {
    ws.close(1008, "Unauthorized");
    return;
  }

  try {
    const decoded = await verifyToken(token);
    ws.user = decoded;

    // Auth0 tokens typically have the user ID in the 'sub' claim
    const userId = (decoded as any)?.sub || "unknown";

    const uploadService = new UploadService(userId);
    uploadService.startUpload();

    ws.on("close", () => {
      console.log("Client disconnected.");
      uploadService.endUpload();
    });

    ws.on("message", (message) => {
      uploadService.writeData(message);
    });
  } catch (err: any) {
    console.error(err.message);
    ws.close(1008, "Unauthorized");
  }
};
