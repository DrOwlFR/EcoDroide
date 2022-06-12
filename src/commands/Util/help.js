const { Command } = require("sheweny");

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      category: "Util",
      description: "Affiche la liste des commandes, ou de l'aide sur une commande précise.",
      usage: "help <commande>",
      examples: ["help", "help ping"],
      options: [{
        name: "commande",
        description: "Demandez de l'aide pour une commande",
        type: "STRING",
        autocomplete: true,
      }],
    });
  }

  async execute(interaction) {

    const commands = Array.from(this.client.util.getCommands());
    const embed = this.client.functions.embed()
      .setAuthor({ name: "Voici la liste de mes commandes.", iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }));

    if (!interaction.options.getString("commande", false)) {

      embed.setDescription("<:line:904036055345414164><:line:904036055345414164><:line:904036055345414164><:line:904036055345414164><:line:904036055345414164><:line:904036055345414164>");

      const categories = new Set(commands.map((command) => command.category));

      for (let category of categories) {
        const commandInCategory = commands.filter((command) => command.category === category);

        if (!category) category = "Non classée(s)";

        embed.addField(
          `<:right_blue_arrow:904026423608606762> ${category}`,
          `${commandInCategory.map(command => `**\`${command.name}\`** : ${command.description}`).join("\r\n")}`,
        );
      }

      embed.addField("<:line:904036055345414164><:line:904036055345414164><:line:904036055345414164><:line:904036055345414164><:line:904036055345414164><:line:904036055345414164>",
        "**`help <commande>`** pour des informations sur une commande spécifique.\n\nExemple : **`help ping`**");

      return interaction.reply({ embeds: [embed] });
    }

    const command = commands.filter((cmd) => cmd.name === interaction.options.getString("commande"))[0];
    const lines = "<:line:904036055345414164><:line:904036055345414164><:line:904036055345414164><:line:904036055345414164><:line:904036055345414164><:line:904036055345414164>";

    embed.setAuthor({ name: interaction.member.nickname, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
    embed.setTitle(`${command.name} ${command.adminsOnly ? "— ⚠️ Dev Only ⚠️" : ""} ${command.userPermissions.toString() ? `— ⚠️ Requiert : *${command.userPermissions}* ⚠️` : ""}`);
    embed.setDescription(`${command.description}`);
    embed.addFields([
      { name: "Utilisation", value: `${command.usage}`, inline: true },
      { name: `${command.examples.length > 1 ? "Exemples" : "Exemple"}`, value: `${command.examples.length > 1 ? `${command.examples.join("\n")}` : `${command.examples}`}`, inline: true },
      { name: `${lines}`, value: "{} = sous-commande(s) disponible(s)\n<> = option(s) optionnel(s)\n[] = option(s) obligatoire(s)\n\nNe pas inclure les caractères suivants → <> et [] dans vos commandes." },
    ]);

    return interaction.reply({ embeds: [embed] });
  }

  onAutocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    const choices = Array.from(this.client.util.getCommands()).map(cmd => cmd.name);
    const filteredChoices = choices.filter((choice) => choice.startsWith(focusedOption.value)).slice(0, 25);

    interaction
      .respond(filteredChoices.map((choice) => ({ name: choice, value: choice })))
      .catch(console.error);
  }
};