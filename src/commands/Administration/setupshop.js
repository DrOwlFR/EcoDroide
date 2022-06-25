const { Command } = require("sheweny");
const { addItemToShop, capitalizeFirstLetter, removeItemFromShop, showShop } = require("../../structures/providers");

module.exports = class SetupShopCommand extends Command {
  constructor(client) {
    super(client, {
      name: "setupshop",
      category: "Administration",
      description: "Configurer le système d'argent.",
      usage: "setupshop {add|remove}",
      examples: ["setupshop Crédits <:credit:967361148255096882>"],
      userPermissions: ["MANAGE_GUILD"],
      options: [
        {
          name: "add",
          description: "Ajouter un objet à vendre au shop.",
          type: "SUB_COMMAND",
          options: [
            {
              name: "nom",
              description: "Nom de l'objet à ajouter.",
              type: "STRING",
              required: true,
            },
            {
              name: "prix",
              description: "Prix de l'objet à ajouter.",
              type: "NUMBER",
              minValue: 1,
              required: true,
            },
          ],
        },
        {
          name: "remove",
          description: "Enlever un object du shop.",
          type: "SUB_COMMAND",
          options: [{
            name: "objet",
            description: "Objet à retirer au shop.",
            type: "STRING",
            required: true,
            autocomplete: true,
          }],
        },
      ],
    });
  }

  async execute(interaction) {

    const { options, guild } = interaction;

    switch (options.getSubcommand()) {
      case "add": {
        const itemName = capitalizeFirstLetter(options.getString("nom"));
        const itemPrice = options.getNumber("prix");
        const item = {
          name: itemName,
          price: itemPrice,
        };
        addItemToShop(guild, item);
        interaction.reply({ content: `<:shield_check:904023639840669737> L'objet \`${itemName}\` a bien été ajouté au shop.`, ephemeral: true });
        break;
      }
      case "remove": {
        const item = capitalizeFirstLetter(options.getString("objet"));
        const remove = await removeItemFromShop(guild, item);
        console.log(remove);
        if (!remove) return interaction.reply({ content: "<:shield_cross:904023640453050438> L'item que vous souhaitez supprimer n'existe pas.", ephemeral: true });
        interaction.reply({ content: "<:shield_check:904023639840669737> Item supprimé avec succès", ephemeral: true });
        break;
      }
    }
  }
  async onAutocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    const items = await showShop(interaction.guild);
    const choices = [];
    for (const item in items) {
      choices.push(item);
    }
    const filteredChoices = choices.filter((choice) => choice.startsWith(focusedOption.value)).slice(0, 25);

    interaction
      .respond(filteredChoices.map((choice) => ({ name: choice, value: choice })))
      .catch(console.error);
  }
};