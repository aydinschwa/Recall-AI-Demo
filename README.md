# Podcast Assistant Bot Demo - Recall.ai

This is a sample app that demonstrates how to create a podcast assistant bot using [Recall.ai](https://recall.ai), [Deepgram](https://deepgram.com), and [OpenAI](https://platform.openai.com/docs/overview). It's designed to be simple and easy to understand while still being powerful enough to be interesting.

The app deploys a Google Meet bot named Jamie that transcribes any speech occurring in the meeting in real time. It uses OpenAI's GPT to determine whether you're asking it a question and responds to any variation of "Hey Jamie, pull up that video about x". It will then search YouTube for the videos you're asking for and will send links to them in the chat.

The app is built in Node with Express.js. It serves a static homepage to enable users to invite the bot via a Google Meet URL.

## Demo
https://www.loom.com/share/c62c1330c49d413e85db46c01cc49b16?sid=cbaa2e2b-b29d-4d9d-a362-7555d4f3dabc

## Prerequisites

1. [Node.js](https://nodejs.org/en/)
2. [Ngrok](https://ngrok.com/docs/getting-started/)
3. [Recall.ai API Token](https://www.recall.ai/)
4. [Deepgram API Token](https://deepgram.com/)
5. [OpenAI API Token](https://platform.openai.com/docs/overview)

*Note: At the time of writing this, Deepgram gives new users $200 worth of credits to use for free without requiring any payment details.*

## Getting Started

### Clone the Repository
```bash
git clone https://github.com/aydinschwa/Recall-AI-Demo
```

### Navigate into the Cloned Project Directory
```bash
cd Recall-AI-Demo
```

### Install App Dependencies
```bash
npm install
```

### Initialize Your Ngrok Session
Since this app uses webhooks to get the transcript of a conversation in real time, we need a way to forward webhook requests to localhost. Ngrok is the easiest way to do this. Check out [Recall's documentation](https://docs.recall.ai/docs/local-webhook-development) to get set up. Our Express server will be running on port 3000 by default, so run the following command:

```bash
ngrok http --domain {YOUR_STATIC_DOMAIN} 3000
```

### Configure Environment
Create a `.env` file at the top level of the repo. The server is designed to check for the appropriate environment variables when it starts up and will throw an error if any are missing. Your `.env` should contain the following:

```
PORT=3000
BACKEND_URL=[your_ngrok_static_domain]
RECALL_API_KEY=[recall_api_key]
OPENAI_API_KEY=[openai_api_key]
RECALL_WEBHOOK_SECRET=[recall_webhook_secret]
```

To create `RECALL_WEBHOOK_SECRET`, head to the [Recall.ai webhook dashboard](https://us-west-2.recall.ai/dashboard/webhooks/) and click **Add Endpoint**. The endpoint URL should look like this:

```bash
{YOUR_NGROK_STATIC_DOMAIN}/webhook/transcription
```

Copy the signing secret from the webhook's page and paste it into your `.env` file.

Next, head to the [Deepgram Credentials section of the dashboard](https://us-west-2.recall.ai/dashboard/platforms/deepgram) and paste in your Deepgram API key.

### Run the App
Now that the setup is done, we can finally run the app with:

```bash
npm run dev
```

Navigate to `localhost:3000` in your browser to view the entry point for the app.

## Potential Extensions

1. **Improve Context for JamieBot**: Pass the entire transcript of the conversation once the bot has been triggered. Having more context will allow JamieBot to understand more about the direction of the conversation and make more relevant searches. This can be achieved using the [Get Bot Transcript](https://docs.recall.ai/reference/bot_transcript_list) API call. 

2. **Monitor Chat for Invocations**: Allow JamieBot to be invoked via voice or text. This extension would make JamieBot more versatile and user-friendly. This can be achieved using the [Receiving Chat Messages](https://docs.recall.ai/docs/receiving-chat-messages) endpoint.
   
3. **Enhance Search Capabilities**: Improve JamieBot's search capabilities by enabling it to search [Wikipedia](https://www.npmjs.com/package/wikipedia) or [Google](https://www.npmjs.com/package/googleapis). This would broaden the range of information JamieBot can provide, making it more useful.
