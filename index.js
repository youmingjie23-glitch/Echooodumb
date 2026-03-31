require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const answers = require("./answers.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is running.");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    botReady: client.isReady(),
    time: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

function getRandomAnswer() {
  const index = Math.floor(Math.random() * answers.length);
  return answers[index];
}

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim();

  const shouldReply =
    content === "!book" ||
    content.startsWith("!問") ||
    content.includes("解答之書");

  if (!shouldReply) return;

  const answer = getRandomAnswer();

  const embed = new EmbedBuilder()
    .setTitle("📖 解答之書")
    .setDescription(`**${answer}**`)
    .setTimestamp();

  await message.reply({ embeds: [embed] });
});

client.login(process.env.DISCORD_TOKEN);
