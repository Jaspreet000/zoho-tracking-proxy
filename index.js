// index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Allows cross-origin access from any origin
app.use(express.json()); // Parses incoming JSON requests

const PORT = process.env.PORT || 3000;
const ZAPI_KEY = process.env.ZAPI_KEY;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

app.get('/ping', (req, res) => {
  res.send('pong');
});
// POST endpoint to handle tracking requests
app.post('/track-order', async (req, res) => {
  const { order_input } = req.body;

  if (!order_input) {
    return res.status(400).json({ status: 'error', message: 'Missing order_input' });
  }

  try {
    const response = await axios.post(`${WEBHOOK_URL}?zapikey=${ZAPI_KEY}&isdebug=false`, {
      orderInput: order_input  // ✅ Correct key name for Zoho Flow
    });

    console.log('Zoho Flow Response:', response.data);

    res.json(response.data);
  } catch (err) {
    console.error('Error contacting Zoho Flow:', err.message);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});



// Health check endpoint
app.get('/', (req, res) => {
  res.send('Zoho Tracking Proxy is running ✅');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
