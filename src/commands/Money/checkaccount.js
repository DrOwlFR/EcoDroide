const { Command } = require("sheweny");
const { getMemberMoney, getMoneySettings } = require("../../structures/providers");

module.exports = class CheckAccountCommand extends Command {
  constructor(client) {
    super(client, {
      name: "checkaccount",
      category: "Money",
      description: "Affiche vos finances.",
      usage: "checkaccount <membre>",
      examples: ["checkaccount", "checkaccount @Lando"],
      options: [{
        name: "membre",
        description: "Voir les finances d'un membre.",
        type: "USER",
        required: false,
      }],
    });
  }

  async execute(interaction) {

    const { options, member, guild } = interaction;
    const target = options.getMember("membre") || member;
    const targetCredits = await getMemberMoney(target);
    const moneySettings = await getMoneySettings(guild);

    if (targetCredits === 0) {
      if (target === member) return interaction.reply(`Vous ne possédez actuellement aucun ${moneySettings}.`);
      else return interaction.reply(`Ce membre ne possède actuellement aucun ${moneySettings}.`);
    }

    return interaction.reply({
      embeds: [
        this.client.functions.embed()
          .setAuthor({ name: target.displayName, iconURL: target.displayAvatarURL({ dynamic: true }) })
          .setTitle(`💰 Épargne de ${target.displayName}`)
          .setDescription(`${target} possède \`${targetCredits}\` ${moneySettings}.`),
      ],
    });

  }
};