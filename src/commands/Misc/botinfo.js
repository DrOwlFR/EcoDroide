const { Command } = require("sheweny");
const { version } = require("../../../package.json");
const { dependencies } = require("../../../package.json");

module.exports = class BotInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "botinfo",
      category: "Misc",
      description: "Donne des informations sur le bot.",
      usage: "botinfo",
      examples: ["botinfo"],
    });
  }

  async execute(interaction) {

    const bot = this.client;

    const readyAtDate = new Date(bot.readyAt);
    const readyAtDay = new Intl.DateTimeFormat("fr-FR", { weekday: "long" }).format(readyAtDate);
    const readyAtMonth = new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(readyAtDate);
    const readyAtYear = new Intl.DateTimeFormat("fr-FR", { year: "numeric" }).format(readyAtDate);
    const readyAtDateFR = `${readyAtDay} ${readyAtDate.getDate()} ${readyAtMonth} ${readyAtYear} à ${readyAtDate.getHours()}h${readyAtDate.getMinutes()}`;

    const createdAtDate = new Date(bot.user.createdAt);
    const createdAtDay = new Intl.DateTimeFormat("fr-FR", { weekday: "long" }).format(createdAtDate);
    const createdAtMonth = new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(createdAtDate);
    const createdAtYear = new Intl.DateTimeFormat("fr-FR", { year: "numeric" }).format(createdAtDate);
    const createdAtDateFR = `${createdAtDay} ${createdAtDate.getDate()} ${createdAtMonth} ${createdAtYear} à ${createdAtDate.getHours()}h${createdAtDate.getMinutes()}`;

    const createdTimestamp = parseInt(bot.user.createdTimestamp / 1000);
    const uptime = parseInt(this.client.readyTimestamp / 1000);
    const trueUsers = this.client.users.cache.filter(user => !user.bot);
    const channels = this.client.channels.cache.filter(channel => channel.type !== "GUILD_CATEGORY");

    return interaction.reply({
      embeds: [
        this.client.functions.embed()
          .setTitle(`${bot.user.username} | id : ${bot.user.id}`)
          .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
          .addFields([
            { name: "🗓️ Date de création", value: `${createdAtDateFR}, <t:${createdTimestamp}:R>` },
            { name: "<:developer:904040470294954084> Développeur", value: `${"```"} Grand Maître Hibou#3083 ${"```"}` },
            { name: "<:high_connection:904023638813052988> Uptime", value: `<t:${uptime}:R>` },
            { name: "<:download:904023638267797536> En ligne depuis le", value: `${"```"} ${readyAtDateFR} ${"```"}` },
            { name: "<:verified:904023640062951495> Vérifié", value: `${"```"} ${bot.user.verified} ${"```"}` },
            { name: "<:compass:904023639907790870> Serveurs", value: `${"```"} ${bot.guilds.cache.size} ${"```"}`, inline: true },
            { name: "<:chat:904023637764493313> Salons", value: `${"```"} ${channels.size} ${"```"}`, inline: true },
            { name: "<:members:904023638972456971> Utilisateurs", value: `${"```"} ${trueUsers.size} ${"```"}`, inline: true },
            { name: "<:bot:904023637579935835> Bot", value: `${"```"} v.${version} ${"```"}`, inline: true },
            { name: "<:nodejs:904042314392035338> Runtime", value: `${"```"} Node.js v.16.14.2 ${"```"}`, inline: true },
            { name: "<:djs:904042314006147073> API", value: `${"```"} Discord.js v${dependencies["discord.js"]} ${"```"}`, inline: true },
            { name: "<:sheweny:926450401459458048> Framework", value: `${"```"} Sheweny v${dependencies["sheweny"]} ${"```"}` },
          ]),
      ],
    });

  }
};