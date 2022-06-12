const { Member, Guild } = require("./schemas/models");

// Members DB functions

async function getMember(member) {
  let memberData = await Member.findOne({ userID: member.id, guildID: member.guild.id });
  if (!memberData) memberData = createMember(member);
  return memberData;
}

async function createMember(member) {
  if (await Member.findOne({ userID: member.id, guildID: member.guild.id })) return;
  const newMember = await (new Member({ userID: member.id, guildID: member.guild.id })).save();
  return newMember;
}

async function updateMember(member, settings) {
  let memberData = await getMember(member);
  if (typeof memberData !== "object") memberData = {};
  for (const key in settings) {
    if (memberData[key] !== settings[key]) memberData[key] = settings[key];
  }
  return memberData.updateOne(settings);
}

async function getAllGuildMembers(guild) {
  const guildMembers = await Member.find({ guildID: guild.id });
  return guildMembers;
}

// Guild DB functions

async function getGuild(guild) {
  let guildData = await Guild.findOne({ guildID: guild.id });
  if (!guildData) guildData = createGuild(guild);
  return guildData;
}

async function createGuild(guild) {
  if (await Guild.findOne({ guildID: guild.id })) return;
  const newGuild = await (new Guild({ guildID: guild.id })).save();
  return newGuild;
}

async function updateGuild(guild, settings) {
  let guildData = await getGuild(guild);
  if (typeof guildData !== "object") guildData = {};
  for (const key in settings) {
    if (guildData[key] !== settings[key]) guildData[key] = settings[key];
  }
  return guildData.updateOne(settings);
}

async function getMoneySettings(guild) {
  guild = await getGuild(guild);
  const { moneyName, moneyEmoji } = guild;
  if (!moneyEmoji) return moneyName;
  return moneyEmoji;
}

// Economy functions

async function getMemberMoney(member, guild) {
  member = await getMember(member, guild);
  return member.credits;
}

async function getMemberInventory(member) {
  member = await getMember(member);
  return member.inventory;
}

async function addMoney(member, amount) {
  const memberData = await getMember(member);
  memberData.credits += amount;
  updateMember(member, { credits: memberData.credits });
}

async function removeMoney(member, amount) {
  const memberData = await getMember(member);
  memberData.credits -= amount;
  updateMember(member, { credits: memberData.credits });
}

async function daily(member) {
  const memberData = await getMember(member);
  const now = new Date();
  if (memberData.daily.getDate() != now.getDate()) {
    memberData.credits += 1000;
    memberData.daily = now;
    await updateMember(member, { credits: memberData.credits, daily: memberData.daily });
    return true;
  }
  return false;
}

// Shop

async function buyItemFromShop(member, item) {
  const memberData = await getMember(member);
  memberData.credits -= item.price;
  memberData.inventory.push(item.name);
  updateMember(member, { credits: memberData.credits, inventory: memberData.inventory });
}

async function sellItemFromInventory(member, item) {
  const memberData = await getMember(member);
  memberData.credits += item.price;
  memberData.inventory.splice(memberData.inventory.indexOf(item.name), 1);
  updateMember(member, { credits: memberData.credits, inventory: memberData.inventory });
}

async function showShop(guild) {
  let guildData = await getGuild(guild);
  guildData = guildData.shop;
  return guildData;
}

async function addItemToShop(guild, item) {
  const guildData = await getGuild(guild);
  guildData.shop[item.name] = item;
  updateGuild(guild, { shop: guildData.shop });
}

async function removeItemFromShop(guild, item) {
  const guildData = await getGuild(guild);
  if (!guildData.shop[item]) return undefined;
  delete guildData.shop[item];
  updateGuild(guild, { shop: guildData.shop });
}

// Other

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = { getMember, createMember, updateMember, getGuild, createGuild, updateGuild, getAllGuildMembers, getMoneySettings, getMemberMoney, getMemberInventory, addMoney, removeMoney, daily, buyItemFromShop, sellItemFromInventory, showShop, addItemToShop, removeItemFromShop, capitalizeFirstLetter };