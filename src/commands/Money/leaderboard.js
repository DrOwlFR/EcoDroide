const { Command } = require("sheweny");
const { getAllGuildMembers, getMoneySettings } = require("../../structures/providers");

module.exports = class LeaderboardCommand extends Command {
  constructor(client) {
    super(client, {
      name: "leaderboard",
      category: "Money",
      description: "Affiche le classement des 10 membres les plus riches.",
      usage: "leaderboard",
      examples: ["leaderboard"],
    });
  }

  async execute(interaction) {

    const { guild } = interaction;
    const moneySettings = await getMoneySettings(guild);
    const ranking = (await getAllGuildMembers(guild)).sort((a, b) => b.credits - a.credits).map((data, key) => {
      const places = ["🥇", "🥈", "🥉"];
      return `${places[key] || key + 1 + "."} <@${data.userID}> <:right_blue_arrow:904026423608606762> ${data.credits} ${moneySettings}`;
    }).slice(0, 10).join("\n");

    if (!ranking) return interaction.reply("Il n'y a pas encore de classement au sein de ce serveur.");

    return interaction.reply({
      embeds: [
        this.client.functions.embed()
          .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
          .setTitle("🏆 Classements des dix premières fortunes")
          .setDescription(ranking),
      ],
    });

  }
};