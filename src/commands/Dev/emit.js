const { Command } = require("sheweny");

module.exports = class EmitCommand extends Command {
  constructor(client) {
    super(client, {
      name: "emit",
      description: "Emet un évènement au choix.",
      category: "Dev",
      adminsOnly: true,
      usage: "emit [évènement]",
      examples: ["emit guildMemberAdd"],
      options: [{
        name: "évènement",
        description: "Choisir un évènement à émettre",
        type: "STRING",
        required: true,
        choices: [
          {
            name: "guildMemberAdd",
            value: "guildMemberAdd",
          },
          {
            name: "guildMemberRemove",
            value: "guildMemberRemove",
          },
          {
            name: "guildCreate",
            value: "guildCreate",
          },
          {
            name: "guildRemove",
            value: "guildRemove",
          },
        ],
      }],
    });
  }

  async execute(interaction) {

    const { options, member, guild } = interaction;
    const choice = options.getString("évènement");

    switch (choice) {
      case "guildMemberAdd":
        this.client.emit("guildMemberAdd", member);
        interaction.reply({ content: "<:round_check:904023639400255528> Évènement `guildMemberAdd` émit.", ephemeral: true });
        break;
      case "guildMemberRemove":
        this.client.emit("guildMemberRemove", member);
        interaction.reply({ content: "<:round_check:904023639400255528> Évènement `guildMemberRemove` émit.", ephemeral: true });
        break;
      case "guildCreate":
        this.client.emit("guildCreate", guild);
        interaction.reply({ content: "<:round_check:904023639400255528> Évènement `guildCreate` émit.", ephemeral: true });
        break;
      case "guildRemove":
        this.client.emit("guildRemove", guild);
        interaction.reply({ content: "<:round_check:904023639400255528> Évènement `guildRemove` émit.", ephemeral: true });
        break;
    }

  }
};

