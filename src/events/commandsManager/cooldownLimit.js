const { Event } = require("sheweny");

module.exports = class cooldownLimitEvent extends Event {
  constructor(client) {
    super(client, "cooldownLimit", {
      description: "Cooldown",
      once: false,
      emitter: client.managers.commands,
    });
  }

  execute(interaction, time) {

    const remaining = Math.round(time / 1000);
    return interaction.reply({ content: `<:warn:904061588095528990> Du calme. Il te reste **\`${remaining} seconde${remaining > 1 ? "s" : ""}\`** de cooldown sur la commande \`${interaction}\`.`, ephemeral: true });

  }
};