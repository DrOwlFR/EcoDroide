const { Command } = require("sheweny");
const { getMemberMoney, addMoney, getMoneySettings, getMemberInventory, capitalizeFirstLetter, giveItemToTarget } = require("../../structures/providers");

module.exports = class GiveCommand extends Command {
  constructor(client) {
    super(client, {
      name: "give",
      category: "Trade",
      description: "Donner des crédits ou un objet à un membre.",
      usage: "give {money|item}",
      examples: ["give money Amaël 1000", "give item Solo Blaster"],
      userPermissions: ["MANAGE_GUILD"],
      options: [
        {
          name: "money",
          description: "Donner de l'argent à un membre.",
          type: "SUB_COMMAND",
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
        },
        {
          name: "item",
          description: "Donner un objet à un membre.",
          type: "SUB_COMMAND",
          options: [
            {
              name: "membre",
              description: "Membre auquel ajouter de l'argent.",
              type: "USER",
              required: true,
            },
            {
              name: "objet",
              description: "Objet à donner.",
              type: "STRING",
              required: true,
              autocomplete: true,
            },
          ],
        },
      ],
    });
  }

  async execute(interaction) {

    const { options, guild, member } = interaction;
    const subCommand = options.getSubcommand();
    const target = options.getMember("membre", true);
    const targetCredits = await getMemberMoney(target);
    const moneySettings = await getMoneySettings(guild);

    switch (subCommand) {
      case "money": {
        const amount = options.getNumber("montant");
        if (amount === 0) return interaction.reply({ content: "<:shield_cross:904023640453050438> On n'ajoute pas du vide. Apprenez à compter.", ephemeral: true });

        addMoney(target, amount);
        interaction.reply({
          embeds: [
            this.client.functions.embed()
              .setAuthor({ name: target.displayName, iconURL: target.displayAvatarURL({ dynamic: true }) })
              .setTitle(`<:plus:904455525838766170> Ajout d'argent à ${target.displayName}`)
              .setDescription(`Le montant ${amount} a été ajouté à ${target}.\n${target} possède à présent ${targetCredits + amount} ${moneySettings}.`),
          ],
        });
      }
        break;
      case "item": {
        const memberInventory = await getMemberInventory(member);
        const itemName = capitalizeFirstLetter(options.getString("objet"));
        if (!memberInventory.includes(itemName)) return interaction.reply("Vous ne possédez pas cet objet dans votre sac, vous ne pouvez donc pas le donner.");
        giveItemToTarget(member, target, itemName);
      }
        break;
    }

  }
  async onAutocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    const items = await getMemberInventory(interaction.member);
    const choices = [];
    for (const item of items) {
      choices.push(item);
    }
    const filteredChoices = choices.filter((choice) => choice.startsWith(focusedOption.value)).slice(0, 25);

    interaction
      .respond(filteredChoices.map((choice) => ({ name: choice, value: choice })))
      .catch(console.error);
  }
};