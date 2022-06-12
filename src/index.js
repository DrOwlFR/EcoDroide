const { ShewenyClient } = require("sheweny");
const { embed, emojiRegex } = require("./structures/functions");
const { connect } = require("mongoose");
const { MONGO_TOKEN, DISCORD_TOKEN } = require("./structures/config");

const client = new ShewenyClient({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES"],
  admins: ["158205521151787009"],
  managers: {
    commands: {
      directory: "./commands",
      autoRegisterApplicationCommands: true,
      guildId: ["467310144901087233"],
      loadAll: true,
      prefix: "e.",
      default: {
        cooldown: 3,
        type: "SLASH_COMMAND",
        channel: "GUILD",
      },
    },
    events: {
      directory: "./events",
      loadAll: true,
    },
    inhibitors: {
      directory: "./inhibitors",
      loadAll: true,
    },
    buttons: {
      directory: "./interactions/buttons",
      loadAll: true,
    },
    selectMenus: {
      directory: "./interactions/selectmenus",
      loadAll: true,
    },
  },
  mode: "development",
});

client.functions = {
  embed: embed,
  emojiRegex: emojiRegex,
};

(async function() {
  try {
    connect(MONGO_TOKEN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log("Base de données connectée !");

  } catch (e) {
    console.log("Base de données non connectée : ", e);
    return process.exit();
  };
})();
client.login(DISCORD_TOKEN);
