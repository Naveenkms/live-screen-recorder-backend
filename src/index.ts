import "./config/env";
import { WebSocketServer } from "ws";
import { ENV } from "./config/env";
import { handleWebSocketConnection } from "./handlers/websocket.handler";

const port = Number(ENV.PORT) || 8080;
const wss = new WebSocketServer({ port });

wss.on("connection", handleWebSocketConnection as any);

console.log(`WebSocket server started on port ${port}`);
