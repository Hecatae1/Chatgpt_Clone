require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); // Ensure you have node-fetch installed
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/chat', (req, res) => {
  res.send("API is working! Send a POST request with JSON to chat with me.");
});
app.post('/api/chat', async (req, res) => {
  console.log("Received a request at /api/chat");

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    if (data.error) {
      console.error("OpenAI API error:", data.error);
    }
    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: 'Error communicating with OpenAI API' });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));