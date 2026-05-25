require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  AttachmentBuilder
} = require('discord.js');

const {
  createCanvas,
  loadImage
} = require('@napi-rs/canvas');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log(`✅ 已登入 ${client.user.tag}`);
});

client.on('guildMemberAdd', async (member) => {

  // ❌ 避免 bot 觸發
  if (member.user.bot) return;

  // 📢 歡迎頻道
  const channel = member.guild.channels.cache.get('1508382356505886873');

  if (!channel) return;

  // 🎲 隨機歡迎語
  const welcomeMessages = [
    `踏入劍來 風雲再起`,
    `江湖路遠　劍來同行`,
    `劍來之人　不懼風雨`,
    `今日入劍來　此生皆同袍`,
    `劍來再添一名江湖俠客`
  ];

  const randomMessage =
    welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

  // 👥 成員數
  const memberCount = member.guild.memberCount;

  /*
  // 🎭 自動身分組
  const role = member.guild.roles.cache.find(
    r => r.name === '新手'
  );

  if (role) {
    member.roles.add(role).catch(console.error);
  }
  */
  
  // =========================
  // 🎨 開始生成歡迎卡
  // =========================

  // 📏 卡片大小
  const canvas = createCanvas(1000, 400);
  const ctx = canvas.getContext('2d');

  // 🖼️ 背景圖
  const background = await loadImage(
    'https://imgur.com/pOtzCRT.png'
  );

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // 🌑 黑色半透明 Overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // =========================
  // 👤 Avatar 圓形裁切
  // =========================

  const avatarURL = member.user.displayAvatarURL({
    forceStatic: true,
    extension: 'png',
    size: 256
  });

  const avatar = await loadImage(avatarURL);

  const avatarX = 70;
  const avatarY = 100;
  const avatarSize = 180;

  ctx.save();

  ctx.beginPath();
  ctx.arc(
    avatarX + avatarSize / 2,
    avatarY + avatarSize / 2,
    avatarSize / 2,
    0,
    Math.PI * 2,
    true
  );

  ctx.closePath();
  ctx.clip();

  ctx.drawImage(
    avatar,
    avatarX,
    avatarY,
    avatarSize,
    avatarSize
  );

  ctx.restore();

  // 🟡 金色外框
  ctx.beginPath();
  ctx.arc(
    avatarX + avatarSize / 2,
    avatarY + avatarSize / 2,
    avatarSize / 2 + 5,
    0,
    Math.PI * 2
  );

  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 6;
  ctx.stroke();

  // =========================
  // 🏮 標題
  // =========================

  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 42px sans-serif';
  ctx.fillText(
    '劍來之處 · 無人能擋',
    300,
    120
  );

  // =========================
  // ⚔️ 使用者名稱
  // =========================

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 50px sans-serif';

  ctx.fillText(
    member.user.username,
    300,
    200
  );

  // =========================
  // 📝 隨機歡迎語
  // =========================

  ctx.fillStyle = '#DDDDDD';
  ctx.font = '32px sans-serif';

  ctx.fillText(
    randomMessage,
    300,
    260
  );

  // =========================
  // 👥 成員數
  // =========================

  ctx.fillStyle = '#AAAAAA';
  ctx.font = '26px sans-serif';

  ctx.fillText(
    `第 ${memberCount} 位少東家`,
    300,
    320
  );

  // =========================
  // 📦 輸出圖片
  // =========================

  const attachment = new AttachmentBuilder(
    await canvas.encode('png'),
    { name: 'welcome-card.png' }
  );

  // 📤 發送卡片
  channel.send({
    content: `🏮 歡迎 ${member} 加入《劍來》！`,
    files: [attachment]
  });

});

client.login(process.env.TOKEN);

/* RUN THIS IN TERMINAL TO PUSH TO GITHUB  
git config --global user.email "kelvinkwh99@gmail.com" 
git config --global user.name "Kelvin"
git add .                 // (add all changes, change . to specific file if needed)
git commit -m "first bot" // (commit changes, change message as needed)
git remote add origin https://github.com/kkwh99/hongxian-bot.git // (only need to do this once)
git branch -M main // change branch name to main (only need to do this once)
git push -u origin main   // (push to github)

*/