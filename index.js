const express = require("express");
const path = require("path");
const config = require("./config");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/api");
const webhookRoutes = require("./routes/webhook");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());

app.use("/api", apiRoutes);
app.use("/webhook", webhookRoutes);

// serve homepage for user to invite bot
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
