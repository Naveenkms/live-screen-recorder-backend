import "./config/env";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { ENV } from "./config/env";
import { handleWebSocketConnection } from "./handlers/websocket.handler";
import { connectDB } from "./config/db";
import videoRoutes from "./routes/video.routes";

const app = express();
app.use(express.json());

app.use("/api/videos", videoRoutes);

const port = Number(ENV.PORT);

const server = http.createServer(app);

// Attach websocket to the HTTP server
const wss = new WebSocketServer({ server });

wss.on("connection", handleWebSocketConnection as any);

async function startServer() {
  await connectDB();

  server.listen(port, () => {
    console.log(`Server and WebSocket listening on port ${port}`);
  });
}

startServer();
