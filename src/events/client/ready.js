const { Event } = require("sheweny");
const { version } = require("../../../package.json");

module.exports = class ReadyEvent extends Event {
  constructor(client) {
    super(client, "ready", {
      description: "Client is logged in",
      once: true,
      emitter: client,
    });
  }

  execute() {
    const trueUsers = this.client.users.cache.filter(user => !user.bot).size;
    const channels = this.client.channels.cache.filter(channel => channel.type !== "GUILD_CATEGORY").size;
    const guildsIn = this.client.guilds.cache.size;

    const ListeStatus = [
      `${guildsIn} serveurs.`,
      `${trueUsers} utilisateurs.`,
      `la v.${version}`,
    ];

    let index = 0;
    setInterval(() => {
      if (index === ListeStatus.length) index = 0;
      const status = ListeStatus[index];

      this.client.user.setPresence({ activities: [{ name: `${status}`, type: "WATCHING" }], status: "online" });

      index++;
    }, 7000);

    return console.log(`Le bot économie est prêt et connecté en tant que ${this.client.user.tag} ! ${guildsIn} serveurs. ${trueUsers} utilisateurs et ${channels} salons.`);
  }
};
