const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const app = express();
const port = 3000;

dotenv.config();

const RECALL_API_KEY = process.env.RECALL_API_KEY;
const RECALL_WEBHOOK_SECRET = process.env.RECALL_WEBHOOK_SECRET;
const BACKEND_URL = process.env.BACKEND_URL;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get("/api/test", async (req, res) => {
  const url = 'https://us-west-2.recall.ai/api/v1/bot/';
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Token ${RECALL_API_KEY}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    data: {
      meeting_url: "https://meet.google.com/xhg-ukdb-mbw",
      transcription_options: { provider: 'deepgram' },
      automatic_leave: {
        bot_detection: {
          using_participant_names: { matches: [], timeout: 3600, activate_after: 1200 }
        }
      },
    }
  };

  try {
    const response = await axios(url, options);
    res.send(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('error:', error);
    res.status(500).send('An error occurred');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
