// config.js
const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVars = [
  "PORT",
  "RECALL_API_KEY",
  "RECALL_WEBHOOK_SECRET",
  "BACKEND_URL",
  "OPENAI_API_KEY",
];

const validateEnvVars = (vars) => {
  const missingVars = vars.filter((v) => !process.env[v]);
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
};

validateEnvVars(requiredEnvVars);

module.exports = {
  port: process.env.PORT || 3000,
  recallApiKey: process.env.RECALL_API_KEY,
  recallWebhookSecret: process.env.RECALL_WEBHOOK_SECRET,
  backendUrl: process.env.BACKEND_URL,
  openaiApiKey: process.env.OPENAI_API_KEY,
};
