const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class KickCommand extends commando.Command {
  constructor(bot) {
    super(bot, {
      name: 'kick',
      aliases: [],
      group: 'moderation',
      memberName: 'kick',
      description: 'Kicks a specified user.',
      details: oneLine `
				This command kicks a user.
        Users will be able to rejoin if they get an invite.
        Permission is locked to members with the master role.
			`,
      examples: ['kick @Bob#1234 Being a butt'],
      args: [{
          key: 'user',
          label: 'user',
          prompt: 'What user would you like to kick? Please specify one only.',
          type: 'member',
          infinite: false
        },
        {
          key: 'reason',
          label: 'reason',
          prompt: 'Why is the user being kicked?',
          type: 'string',
          infinite: false
        },
      ],

      guildOnly: true,

      guarded: true
    });
  }

  async run(msg, args) {
    if (!this.client.isOwner(msg.author)) {
      let allowed = msg.guild.settings.get('masterrole')
      let allowed2 = msg.guild.settings.get('superrole')
      if (!allowed) return msg.reply(':warning: **This command is not set up to work!** Have your server owner run the setup command.')
      if (!allowed2) return msg.reply(':warning: **This command is not set up to work!** Have your server owner run the setup command.')
      if (!msg.member.roles.has(allowed)) {
        if (!msg.member.roles.has(allowed2)) return msg.reply(':warning: **You do not have permission to use this command!**')
      }
    }
    if (!msg.guild.member(this.client.user).hasPermission('KICK_MEMBERS')) return msg.reply(':warning: **I do not have permission to kick members!**')

    await args.user.send(`You have been kicked from the server '${msg.guild}'!
Staff member: ${msg.author.username}
Reason: '${args.reason}'`)
    msg.channel.send(`${args.user}, You know the law - testing IS NOT a dance exemption.`)

    args.user.kick(args.reason)
  }
};
