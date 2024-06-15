
# Podcast Assistant Bot Demo - Recall.ai

This is a sample app that demonstrates how to create a podcast assistant bot using [Recall.ai](https://recall.ai), [Deepgram](https://deepgram.com), and [OpenAI](https://platform.openai.com/docs/overview). It's deliberately designed to be simple and easy to understand while still being powerful enough to be interesting.  

The app deploys a Google Meet bot that transcribes any speech occurring in the meeting in real time. It uses OpenAI's GPT to determine whether you're asking it a question, and should respond to any variation of "Hey Jamie, pull up that video about x". It will then search Youtube for the videos you're asking for and will send links to them in the chat.

The app is built in Node with Express.js. It serves a static homepage to enable users to invite the bot via a Google Meet URL.

# Prerequisites

1. [Node.js](https://nodejs.org/en/)
2. [Ngrok](https://ngrok.com/docs/getting-started/)
3. [Recall.ai API Token](https://www.recall.ai/)
4. [Deepgram API Token](https://deepgram.com/)
5. [OpenAI API Token](https://platform.openai.com/docs/overview)

Note: at the time of writing this, Deepgram gives new users $200 worth of credits to use for free without requiring any payment details.

# Getting Started



