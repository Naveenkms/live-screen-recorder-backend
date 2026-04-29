import "./config/env";
import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import { ENV } from "./config/env";
import { handleWebSocketConnection } from "./handlers/websocket.handler";
import { connectDB } from "./config/db";
import videoRoutes from "./routes/video.routes";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();
app.use(
  cors({
    origin: ENV.ALLOWED_ORIGINS.split(","),
  }),
);
app.use(express.json());

app.use("/api/videos", videoRoutes);

const port = Number(ENV.PORT);

const server = http.createServer(app);

// Attach websocket to the HTTP server
const wss = new WebSocketServer({ server });

wss.on("connection", handleWebSocketConnection as any);

app.use(errorMiddleware);

async function startServer() {
  await connectDB();

  server.listen(port, () => {
    console.log(`Server and WebSocket listening on port ${port}`);
  });
}

startServer();
  