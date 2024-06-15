# Podcast Assistant Bot Demo - Recall.ai

This is a sample app that demonstrates how to create a podcast assistant bot using [Recall.ai](https://recall.ai), [Deepgram](https://deepgram.com), and [OpenAI](https://platform.openai.com/docs/overview). It's designed to be simple and easy to understand while still being powerful enough to be interesting.  

The app deploys a Google Meet bot that transcribes any speech occurring in the meeting in real time. It uses OpenAI's GPT to determine whether you're asking it a question and responds to any variation of "Hey Jamie, pull up that video about x". It will then search YouTube for the videos you're asking for and will send links to them in the chat.

The app is built in Node with Express.js. It serves a static homepage to enable users to invite the bot via a Google Meet URL.

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
Let's get our environment set up now so we don't have to worry about it later. There are five required environment variables:

- `RECALL_API_KEY`
- `RECALL_WEBHOOK_SECRET`
- `BACKEND_URL`
- `DEEPGRAM_API_KEY`
- `OPENAI_API_KEY`

The server is designed to check for these variables when it starts up and will throw an error if any are missing. Create a `.env` file and start adding the environment variables.

To create `RECALL_WEBHOOK_SECRET`, head to the [Recall.ai webhook dashboard](https://us-west-2.recall.ai/dashboard/webhooks/) and click **Add Endpoint**. The endpoint URL should look like this:

```bash
{YOUR_NGROK_STATIC_DOMAIN}/webhook/transcription
```

Copy the signing secret from the webhook's page. Also, `BACKEND_URL` is just your Ngrok static domain.

### Run the App
Now that the setup is done, we can finally run the app with:

```bash
npm run dev
```

Navigate to `localhost:3000` to view the entry point for the app.
