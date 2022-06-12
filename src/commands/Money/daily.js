const { Command } = require("sheweny");
const { daily, getMoneySettings, getMemberMoney } = require("../../structures/providers");

module.exports = class DailyCommand extends Command {
  constructor(client) {
    super(client, {
      name: "daily",
      category: "Money",
      description: "Ajoute de l'argent tous les jours.",
      usage: "daily",
      examples: ["daily"],
    });
  }

  async execute(interaction) {

    const { member, guild } = interaction;
    const dailyResult = await daily(member);
    const moneySettings = await getMoneySettings(guild);
    const memberCredits = await getMemberMoney(member);

    if (dailyResult) {
      return interaction.reply({
        embeds: [
          this.client.functions.embed()
            .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL({ dynamic: true }) })
            .setTitle("<:round_check:904023639400255528> Épargne mise à jour")
            .setDescription(`1000 ${moneySettings} ajoutés.\nVous possédez à présent ${memberCredits} ${moneySettings}.\n\n**Revenez demain !**`),
        ],
      });
    }
    return interaction.reply("<:round_cross:904023639433822288> Vous avez déjà reçu votre gain journalier, revenez demain.");

  }
};