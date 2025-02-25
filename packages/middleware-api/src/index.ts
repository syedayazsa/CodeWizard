// src/index.ts
import express from 'express';

const app = express();
app.use(express.json());

// Example route
app.post('/llm/completion', async (req, res) => {
  // Extract prompt from req.body
  const { prompt } = req.body;
  // ... call your LLM or do some logic ...
  const fakeCompletion = `You said: ${prompt}`;
  res.json({ completion: fakeCompletion });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Middleware API listening on port ${PORT}`);
});

