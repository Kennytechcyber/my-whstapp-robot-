const config = require('../config')
const {
  bot,
  setWarn,
  jidToNum,
  // genButtonMessage,
  isAdmin,
  deleteWarn,
} = require('../lib/')

bot(
  {
    pattern: 'warn ?(.*)',
    fromMe: true,
    desc: 'warn users in chat',
    type: 'group',
    onlyGroup: true,
  },
  async (message, match) => {
    if (!match && !message.reply_message)
      return await message.send('*Example :*\nwarn mention/reply\nwarn reset mention/reply')
    let [m, u] = match.split(' ')
    if (m && m.toLowerCase() == 'reset') {
      u = u && u.endsWith('@s.whatsapp.net') ? u : message.mention[0] || message.reply_message.jid
      if (!u) return await message.send('*Reply or Mention to a user*')
      const count = await setWarn(u, message.jid, (!isNaN(u) && u) || -1)
      const mention = `@${jidToNum(u)}`
      const remaining = config.WARN_LIMIT - count
      const resetMessage = config.WARN_RESET_MESSAGE.replace('&mention', mention)
        .replace('&remaining', remaining)
        .replace('&warn', config.WARN_LIMIT)
      return await message.send(resetMessage, { contextInfo: { mentionedJid: [u] } })
    }
    const user = message.mention[0] || message.reply_message.jid
    if (!user) return await message.send('*Reply or Mention to a user*')
    const count = await setWarn(user, message.jid)
    if (count > config.WARN_LIMIT) {
      const participants = await message.groupMetadata(message.jid)
      const isImAdmin = await isAdmin(participants, message.client.user.jid)
      if (!isImAdmin) return await message.send(`_I'm not admin._`)
      const isUserAdmin = await isAdmin(participants, user)
      if (isUserAdmin) return await message.send(`_I can't Remove admin._`)
      const mention = `@${jidToNum(user)}`
      const kickMessage = config.WARN_KICK_MESSAGE.replace('&mention', mention)
      await message.send(kickMessage, {
        contextInfo: { mentionedJid: [user] },
      })
      await deleteWarn(user, message.jid)
      return await message.Kick(user)
    }
    const mention = `@${jidToNum(user)}`
    const remainWarnCount = config.WARN_LIMIT - count
    const warnMessage = config.WARN_MESSAGE.replace('&mention', mention)
      .replace('&remaining', remainWarnCount)
      .replace('&reason', match)
      .replace('&warn', config.WARN_LIMIT)
    await message.send(warnMessage, { contextInfo: { mentionedJid: [user] } })
    // return await message.send(
    // 	await genButtonMessage(
    // 		[{ id: `warn reset ${user}`, text: 'RESET' }],
    // 		`🚯LINK DELETED FROM NONE ADMINS🚯\n*User :* @${jidToNum(
    // 			user
    // 		)}\n*Warn :* ${count}\n*Remaining :* ${config.WARN_LIMIT - count}`
    // 	),
    // 	{ contextInfo:👋You will be kicked out of the group if you dont take THIS WARNING seriouse🤖,No external links are permitted here for none admin, If you have any important Message for the group wish will include a link kindly message any of the group admins, this is for security reasons, THANK YOU. 
             you can contact the creator of this robot if interested in it *(https://wa.me/670217260)*
          
  
)
