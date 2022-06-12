const { Event } = require("sheweny");

module.exports = class UserMissingPermissionsEvent extends Event {
  constructor(client) {
    super(client, "userMissingPermissions", {
      description: "Permission(s) manquante(s) pour l'utilisateur.",
      once: false,
      emitter: client.managers.commands,
    });
  }

  execute(interaction, missing) {

    const missingPermissions = [missing];
    return interaction.reply({ content: `<:shield_cross:904023640453050438> Vous n'avez pas la permission suffisante pour la commande \`${interaction}\`. Permission${missingPermissions.length > 1 ? "s" : ""} manquant${missingPermissions.length > 1 ? "es" : "e"} : *\`${missing}\`*.`, ephemeral: true });

  }
};