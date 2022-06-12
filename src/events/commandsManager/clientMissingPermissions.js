const { Event } = require("sheweny");

module.exports = class ClientMissingPermissionsEvent extends Event {
  constructor(client) {
    super(client, "clientMissingPermissions", {
      description: "Permission(s) manquante(s) pour le bot.",
      once: false,
      emitter: client.managers.commands,
    });
  }

  execute(interaction, missing) {

    const missingPermissions = [missing];
    return interaction.reply(`<:shield_cross:904023640453050438> Je n'ai pas la permission suffisante pour la commande \`${interaction}\`. Permission${missingPermissions.length > 1 ? "s" : ""} manquant${missingPermissions.length > 1 ? "es" : "e"} : *\`${missing}\`*.`);

  }
};