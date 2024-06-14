// routes/api.js
const express = require("express");
const axios = require("axios");
const config = require("../config");

const router = express.Router();

router.get("/invite_bot", async (req, res) => {
  const meetingUrl = req.query.meetingUrl;
  try {
    const response = await axios.post(
      "https://us-west-2.recall.ai/api/v1/bot",
      {
        bot_name: "Jamie",
        meeting_url: meetingUrl,
        real_time_transcription: {
          destination_url: `${config.backendUrl}/webhook/transcription?secret=${config.recallWebhookSecret}`,
        },
        transcription_options: {
          provider: "deepgram",
        },
      },
      {
        headers: {
          Authorization: `Token ${config.recallApiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    res.send(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Failed to invite bot", error);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
