const { Command } = require("sheweny");
const { getMemberInventory } = require("../../structures/providers");

module.exports = class CheckInventoryCommand extends Command {
  constructor(client) {
    super(client, {
      name: "checkinventory",
      category: "Money",
      description: "Affiche le contenu du sac d'un membre.",
      usage: "checkinventory <membre>",
      examples: ["checkinventory", "checkinventory @Lando"],
      options: [{
        name: "membre",
        description: "Voir l'inventaire d'un membre.",
        type: "USER",
        required: false,
      }],
    });
  }

  async execute(interaction) {

    const { options, member } = interaction;
    const target = options.getMember("membre") || member;
    const inventory = await getMemberInventory(target);

    if (inventory == "") {
      if (target === member) return interaction.reply("Vous ne possédez actuellement aucun objet dans votre sac.");
      return interaction.reply("Ce membre ne possède actuellement aucun objet dans son sac.");
    }

    return interaction.reply({
      embeds: [
        this.client.functions.embed()
          .setAuthor({ name: target.displayName, iconURL: target.avatarURL })
          .setTitle(`🎒 Sac de ${target.displayName}`)
          .setDescription(`\`${inventory.join("`, `")}\``)
          .setThumbnail(target.displayAvatarURL),
      ],
    });

  }
};