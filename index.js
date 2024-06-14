const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const { getYouTubeVideos } = require("./utils");

const app = express();
const port = 3000;

dotenv.config();

const RECALL_API_KEY = process.env.RECALL_API_KEY;
const RECALL_WEBHOOK_SECRET = process.env.RECALL_WEBHOOK_SECRET;
const BACKEND_URL = process.env.BACKEND_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());
// Middleware to parse urlencoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const result = await getYouTubeVideos("testing one more time");
  res.send(result);
});

app.get("/api/test", async (req, res) => {
  const url = "https://us-west-2.recall.ai/api/v1/bot/";
  const options = {
    method: "POST",
    headers: {
      Authorization: `Token ${RECALL_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {
      bot_name: "Jamie",
      meeting_url: "https://meet.google.com/qrv-hiri-pnm",
      real_time_transcription: {
        destination_url: `${BACKEND_URL}/webhook/transcription?secret=${RECALL_WEBHOOK_SECRET}`,
      },
      transcription_options: {
        provider: "deepgram",
      },
      automatic_leave: {
        bot_detection: {
          using_participant_names: {
            matches: [],
            timeout: 3600,
            activate_after: 1200,
          },
        },
      },
    },
  };

  try {
    const response = await axios(url, options);
    res.send(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("error:", error);
    res.status(500).send("An error occurred");
  }
});

app.post("/webhook/transcription", async (req, res) => {
  const { event, data } = req.body;

  // web ui isn't allowing me to filter which events the webhook is listening to
  // so I have to do it here
  if (event !== "bot.transcription") {
    return res.status(200).send("OK");
  }
  const { transcript } = data;

  const { words } = transcript;
  const fullText = words.map((word) => word.text).join(" ");
  console.log(fullText);
  // Use OpenAI to check for the phrase
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
           Your response will be in JSON format, either {answer: "YES", query: "query to search on Youtube", remark: ""} or {answer: "NO"}.
           Here's a snippet of their conversation:
           ${fullText}
           `,
        },
      ],
    });
    const data = JSON.parse(response.choices[0].message.content);
    const { answer, query, remark } = data;
    if (answer === "YES") {
      const chatUrl =
        "https://us-west-2.recall.ai/api/v1/bot/ecec8909-4574-4256-a9d5-11f171287947/send_chat_message/";
      const chatOptions = {
        method: "POST",
        headers: {
          Authorization: `Token ${RECALL_API_KEY}`,
          accept: "application/json",
          "content-type": "application/json",
        },
        data: {
          message: remark,
        },
      };
      await axios(chatUrl, chatOptions);
      const videos = await getYouTubeVideos(query);
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
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
            `,
          },
        ],
      });
      const message = response.choices[0].message.content;
      const url =
        "https://us-west-2.recall.ai/api/v1/bot/ecec8909-4574-4256-a9d5-11f171287947/send_chat_message/";
      const options = {
        method: "POST",
        headers: {
          Authorization: `Token ${RECALL_API_KEY}`,
          accept: "application/json",
          "content-type": "application/json",
        },
        data: {
          message: message,
        },
      };
      await axios(url, options);
    }
  } catch (error) {
    console.error("Error with OpenAI API:", error);
  }
  res.status(200).send("OK");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
