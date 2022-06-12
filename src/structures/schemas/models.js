const { Schema, model } = require("mongoose");

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const memberSchema = new Schema({
  userID: String,
  guildID: String,
  credits: { type: Number, default: 0 },
  inventory: { type: Array, default: [] },
  daily: { type: Date, default: yesterday },
});

const guildSchema = new Schema({
  guildID: String,
  moneyName: { type: String, default: "crédit" },
  moneyEmoji: { type: String, default: "<:credit:967361148255096882>" },
  shop: { type: Object, default: {} },
});

module.exports = {
  Member: model("economyuser", memberSchema),
  Guild: model("economyguild", guildSchema),
};