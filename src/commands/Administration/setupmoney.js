const { Command } = require("sheweny");
const { updateGuild } = require("../../structures/providers");

module.exports = class SetupMoneyCommand extends Command {
  constructor(client) {
    super(client, {
      name: "setupmoney",
      category: "Administration",
      description: "Configurer le système d'argent.",
      usage: "setupmoney [nom] <emoji>",
      examples: ["setupmoney Crédits <:credit:967361148255096882>"],
      userPermissions: ["MANAGE_GUILD"],
      options: [
        {
          name: "nom",
          description: "Nom de votre monnaie.",
          type: "STRING",
          required: true,
        },
        {
          name: "emoji",
          description: "Emoji représentant votre monnaie.",
          type: "STRING",
          required: false,
        },
      ],
    });
  }

  async execute(interaction) {

    const { options, guild } = interaction;
    const moneyName = options.getString("nom").toLowerCase();
    const moneyEmoji = options.getString("emoji");

    updateGuild(guild, { moneyName: moneyName, moneyEmoji: moneyEmoji });

    return interaction.reply({
      embeds: [
        this.client.functions.embed()
          .setTitle("<:check:904023638049697853> Mise à jour du système monétaire")
          .setDescription(`Nom de votre monnaie : \`${moneyName}\`\nEmoji de votre monnaie : ${moneyEmoji || "`Aucun`"}`),
      ],
    });
  }
};