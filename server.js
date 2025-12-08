import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const clients = new Map(); // userId → response

// Figma plugin connects here
app.get('/connect', (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).end("missing userId");

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });

  clients.set(userId, res);

  req.on('close', () => {
    clients.delete(userId);
  });
});

// n8n sends prompt here
app.post('/figma-make', (req, res) => {
  const { userId, prompt } = req.body;
  const client = clients.get(userId);

  if (!client) {
    return res.status(404).json({ error: 'User not online in Figma' });
  }

  client.write(`data: ${JSON.stringify({ type: "PROMPT", payload: prompt })}\n\n`);
  res.json({ ok: true });
});

app.listen(3333, () => console.log('Relay running'));
