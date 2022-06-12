const { Command } = require("sheweny");
const { getMemberMoney, addMoney, getMoneySettings } = require("../../structures/providers");

module.exports = class GiveCommand extends Command {
  constructor(client) {
    super(client, {
      name: "give",
      category: "Trade",
      description: "Ajoute des crédits au compte d'un membre.",
      usage: "addcredit [membre] [montant]",
      examples: ["addcredit @X 282"],
      userPermissions: ["MANAGE_GUILD"],
      options: [
        {
          name: "membre",
          description: "Membre auquel ajouter de l'argent.",
          type: "USER",
          required: true,
        },
        {
          name: "montant",
          description: "Montant à donner.",
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

    if (amount === 0) return interaction.reply({ content: "<:shield_cross:904023640453050438> On n'ajoute pas rien. Apprenez à compter.", ephemeral: true });

    addMoney(target, amount);
    return interaction.reply({
      embeds: [
        this.client.functions.embed()
          .setAuthor({ name: target.displayName, iconURL: target.displayAvatarURL({ dynamic: true }) })
          .setTitle(`<:plus:904455525838766170> Ajout d'argent à ${target.displayName}`)
          .setDescription(`Le montant ${amount} a été ajouté à ${target}.\n${target} possède à présent ${targetCredits + amount} ${moneySettings}.`),
      ],
    });

  }
};