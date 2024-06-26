// routes/webhook.js
const express = require("express");
const axios = require("axios");
const OpenAI = require("openai");
const { getYouTubeVideos } = require("../utils");
const config = require("../config");

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

const router = express.Router();

router.post("/transcription", async (req, res) => {
  const { event, data } = req.body;

  // web ui isn't allowing me to filter which events the webhook is listening to
  // so I have to do it here
  if (event !== "bot.transcription") {
    return res.status(200).send("OK");
  }
  const { bot_id, transcript } = data;
  const { words } = transcript;
  const fullText = words.map((word) => word.text).join(" ");
  console.log(fullText)

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Your name is Jamie and you are listening to a conversation between multiple people.
           Your job is to listen carefully to the conversation and when any of the members say any variation
           of "Jamie, look that up", you will respond by saying "YES". 
           If the answer is "YES", formulate a query to search on Youtube that will help return the most relevant
           video to the question asked. Also, say a short sentence about how you're gonna look up that video. 
           Otherwise, you will respond with "NO".
           The conversation snippet you will be given is generated using speech to text, and it may not completely 
           reflect the words actually spoken. 
           Your response will be in JSON format, either 
           {answer: "YES", query: "query to search on Youtube", remark: ""} 
           or 
           {answer: "NO"}.
           Here's a snippet of their conversation:
           ${fullText}
           `,
        },
      ],
    });
    const data = JSON.parse(response.choices[0].message.content);
    const { answer, query, remark } = data;
    console.log(answer, query, remark)
    if (answer === "YES") {
      await axios.post(
        `https://us-west-2.recall.ai/api/v1/bot/${bot_id}/send_chat_message/`,
        { message: remark },
        {
          headers: {
            Authorization: `Token ${config.recallApiKey}`,
            accept: "application/json",
            "content-type": "application/json",
          },
        }
      );
      const videos = await getYouTubeVideos(query);
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: `
            You are Jamie Vernon, the producer and audio engineer for the Joe Rogan Experience podcast. 
            
            You've been asked to pull something up from the internet: ${fullText}.
            You searched Youtube and found the following videos:
            ${JSON.stringify(videos, null, 2)}
            Pick the most relevant videos and include their titles and urls in your response. Give a one-sentence 
            remark in the style of Jamie then add the video titles and links. Format them like this:

            Youtube Title
            URL

            Youtube Title
            URL

            ...

            Your response must be less than 500 characters.
            `,
          },
        ],
      });
      let message = response.choices[0].message.content;
      // Trim the message to 500 characters. Max length of Google Meet chat message is 500 characters.
      message = message.substring(0, 500); 
      console.log(message)
      const res = await axios.post(
        `https://us-west-2.recall.ai/api/v1/bot/${bot_id}/send_chat_message/`,
        { message: message },
        {
          headers: {
            Authorization: `Token ${config.recallApiKey}`,
            accept: "application/json",
            "content-type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Error with OpenAI API:", error);
  }
  res.status(200).send("OK");
});

module.exports = router;
