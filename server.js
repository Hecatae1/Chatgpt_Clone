require('dotenv').config();
const express = require('express');
//const fetch = require('node-fetch'); // Ensure you have node-fetch installed
const cors = require("cors");
const app = express();

app.use(cors({
  origin: "*" 
}));
app.use(express.json());
const API_KEY = process.env.API_KEY; // Load your API key from environment variables
console.log("API key loaded?", !!process.env.OPENAI_API_KEY);
const port = process.env.VITE_API_URL|| 3000;

app.get('/api/chat', (req, res) => {
  res.send("API is working! Send a POST request with JSON to chat with me.");
});
app.post('/api/chat', async (req, res) => {
  console.log("Received a request at /api/chat");
    console.log("Incoming message:", req.body);
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

app.listen(port, () => console.log("Server running on port 3000"));