const { Command } = require("sheweny");

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      category: "Misc",
      description: "Renvoie pong.",
      usage: "ping",
      examples: ["ping"],
    });
  }

  async execute(interaction) {

    const tryPong = await interaction.reply({ content: "Calcul... <a:load:904057195220598845>", fetchReply: true });
    const botLatency = `${"```"}\n ${tryPong.createdTimestamp - interaction.createdTimestamp}ms  ${"```"}`;
    const APILatency = `${"```"}\n ${this.client.ws.ping}ms  ${"```"}`;

    const embed = this.client.functions.embed()
      .setTitle("🏓  Pong !  🏓")
      .addField("🤖  Latence du bot", botLatency, true)
      .addField("💻  Latence de l'API", APILatency, true);

    return interaction.editReply({
      content: null,
      embeds: [embed],
    });

  }
};