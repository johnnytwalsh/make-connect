import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const clients = new Map();

// ---- Middleware ----
app.use(cors());
app.use(bodyParser.json());
app.disable("x-powered-by");

// ---- Health Check ----
app.get("/", (req, res) => {
  res.send("✅ Figma Prompt Relay is running.");
});

// ---- SSE CONNECT ENDPOINT ----
app.get("/connect", (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).send("Missing User ID");
  }

  console.log("🔌 Connection attempt from:", userId);

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  req.socket.setTimeout(0);
  req.socket.setNoDelay(true);
  req.socket.setKeepAlive(true);

  clients.set(userId, res);
  console.log("✅ Connected:", userId);

  const heartbeat = setInterval(() => {
    res.write(":\n\n");
  }, 15000);

  req.on("close", () => {
    clearInterval(heartbeat);
    clients.delete(userId);
    console.log("❌ Disconnected:", userId);
  });
});

// ---- N8N SENDS PROMPT HERE ----
app.post("/figma-make", (req, res) => {
  const { userId, prompt } = req.body;

  if (!userId || !prompt) {
    return res.status(400).json({ error: "userId and prompt required" });
  }

  const client = clients.get(userId);
  if (!client) {
    return res.status(404).json({ error: "User not connected to Figma" });
  }

  const payload = JSON.stringify({ prompt });

  client.write(`event: prompt\n`);
  client.write(`data: ${payload}\n\n`);

  console.log("📨 Prompt delivered to", userId);

  res.json({ success: true });
});

// ---- Startup ----
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`✅ Relay running on port ${PORT}`);
});
