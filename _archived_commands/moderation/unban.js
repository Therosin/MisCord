const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class UnbanCommand extends commando.Command {
  constructor(bot) {
    super(bot, {
      name: 'unban',
      aliases: ['liftban', 'pardon'],
      group: 'moderation',
      memberName: 'unban',
      description: 'Unbans a specified user.',
      details: oneLine `
				This command unbans a user.
        Permission is locked to members with the super role.
			`,
      examples: ['unban 247318700414205952'],
      args: [{
          key: 'user',
          label: 'user',
          prompt: 'What user would you like to kick? Please specify one only. Must be a user ID.',
          type: 'string',
          infinite: false
        },
        {
          key: 'reason',
          label: 'reason',
          prompt: 'Why is the user being unbanned?',
          default: '[The moderator gave no reason.]',
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
      let allowed = msg.guild.settings.get('superrole')
      if (!allowed) return msg.reply(':warning: **This command is not set up to work!** Have your server owner run the setup command.')
      if (!msg.member.roles.has(allowed)) return msg.reply(':warning: **You do not have permission to use this command!**')
    }

    if (!msg.guild.member(this.client.user).hasPermission('BAN_MEMBERS')) return msg.reply(':warning: **I do not have permission to kick members!**')

    args.user.unban(args.user)
      .then(user => {
        msg.reply(`:white_check_mark: **The user ${user.tag} is now unbanned.`)
      })
  }
};
