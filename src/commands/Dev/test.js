const { Command } = require("sheweny");
const { createMember } = require("../../structures/providers");

module.exports = class TestCommand extends Command {
  constructor(client) {
    super(client, {
      name: "test",
      category: "Dev",
      description: "Test",
      usage: "test",
      examples: ["test"],
      options: [{
        name: "membre",
        required: true,
        description: "test",
        type: "USER",
      }],
    });
  }

  async execute(interaction) {

    const member = interaction.options.getMember("membre");
    createMember(member);

  }
};