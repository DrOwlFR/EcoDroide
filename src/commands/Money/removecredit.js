const { Command } = require("sheweny");
const { getMemberMoney, removeMoney, getMoneySettings } = require("../../structures/providers");

module.exports = class RemoveCreditCommand extends Command {
  constructor(client) {
    super(client, {
      name: "removecredit",
      category: "Money",
      description: "Retire des crédits au compte d'un membre.",
      usage: "removecredit [membre] [montant]",
      examples: ["remove @X 282"],
      userPermissions: ["MANAGE_GUILD"],
      options: [
        {
          name: "membre",
          description: "Membre auquel retirer de l'argent.",
          type: "USER",
          required: true,
        },
        {
          name: "montant",
          description: "Montant à retirer",
          type: "NUMBER",
          minValue: 0,
          required: true,
        },
      ],
    });
  }

  async execute(interaction) {

    const { options, guild } = interaction;
    const amount = options.getNumber("montant");
    const target = options.getMember("membre", true);
    const targetCredits = await getMemberMoney(target);
    const moneySettings = await getMoneySettings(guild);

    if (amount === 0) return interaction.reply({ content: "<:shield_cross:904023640453050438> Un bon banquier retire un nombre très positif, pas zéro. On n'est pas là pour stagner.", ephemeral: true });

    removeMoney(target, amount);
    return interaction.reply({
      embeds: [
        this.client.functions.embed()
          .setAuthor({ name: target.displayName, iconURL: target.displayAvatarURL({ dynamic: true }) })
          .setTitle(`<:minus:904455523427037224> Perte d'argent de ${target.displayName}`)
          .setDescription(`Le montant ${amount} a été retiré  à ${target}.\n${target} possède à présent ${targetCredits - amount} ${moneySettings}.`),
      ],
    });

  }
};