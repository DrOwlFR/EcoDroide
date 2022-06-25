const { Command } = require("sheweny");
// const shop = require("../../structures/shop");
const { getMemberMoney, capitalizeFirstLetter, getMemberInventory, buyItemFromShop, sellItemFromInventory, getMoneySettings, showShop } = require("../../structures/providers");

module.exports = class ShopCommand extends Command {
  constructor(client) {
    super(client, {
      name: "shop",
      category: "Money",
      description: "Shop",
      usage: "addcredit [membre] [montant]",
      examples: ["addcredit @X 282"],
      userPermissions: ["MANAGE_GUILD"],
      options: [
        {
          name: "show",
          description: "Affiche le shop.",
          type: "SUB_COMMAND",
        },
        {
          name: "buy",
          description: "Acheter quelque chose.",
          type: "SUB_COMMAND",
          options: [{
            name: "objet",
            description: "Objet à acheter.",
            type: "STRING",
            required: true,
          }],
        },
        {
          name: "sell",
          description: "Vendre quelque chose.",
          type: "SUB_COMMAND",
          options: [
            {
              name: "objet",
              description: "Objet à vendre.",
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

    const { member, guild, options } = interaction;
    const memberCredits = await getMemberMoney(member);
    const memberInventory = await getMemberInventory(member);
    const moneySettings = await getMoneySettings(guild);
    const shop = await showShop(guild);

    switch (options.getSubcommand()) {
      case "show": {
        const shopItems = Object.entries(shop);
        interaction.reply({
          embeds: [
            this.client.functions.embed()
              .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
              .setTitle("🛒 Voici les objets du shop")
              .setDescription(`${shopItems.map(item => `**${item[0]}** - \`${item[1].price}\` ${moneySettings}`).join("\n")}`),
          ],
        });
        break;
      }
      case "buy": {
        const itemName = capitalizeFirstLetter(options.getString("objet"));
        const item = shop[itemName];
        if (!item) return interaction.reply({ content: "Cet item n'existe pas.", ephemeral: true });
        if (item.price > memberCredits) return interaction.reply({ content: `Vous n'avez pas assez d'argent pour acheter cet objet, il vous manque ${item.price - memberCredits}.`, ephemeral: true });
        buyItemFromShop(member, item);
        interaction.reply(`Vous avez acheté \`${item.name}\` pour \`${item.price}\` ${moneySettings}. Il a été placé dans votre sac.`);
        break;
      }
      case "sell": {
        const itemName = capitalizeFirstLetter(options.getString("objet"));
        const item = shop[itemName];
        if (!memberInventory.includes(itemName)) return interaction.reply("Vous ne pouvez pas vendre ce que vous ne possédez pas.");
        sellItemFromInventory(member, item);
        interaction.reply(`Vous avez vendu \`${item.name}\`, \`${item.price}\` ${moneySettings} ont été ajouté à votre bourse.`);
        break;
      }
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