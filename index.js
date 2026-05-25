require('dotenv').config();

const {
  Client,
  GatewayIntentBits
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log(`✅ 已登入 ${client.user.tag}`);
});

client.on('guildMemberAdd', member => {

  const channel = member.guild.channels.cache.find(
    ch => ch.name === '歡迎welcome'
  );

  if (!channel) return;

  channel.send(
`🏮 少俠 ${member} 已踏入燕雲江湖！

願此行：
不負俠義
名動天下！`
  );
});

client.login(process.env.TOKEN);