const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class ClearCommand extends commando.Command {
  constructor(bot) {
    super(bot, {
      name: 'clear',
      aliases: ['prunechannel', 'clearchannel'],
      group: 'moderation',
      memberName: 'clear',
      description: 'Clears messages from the current channel.',
      details: oneLine `
				This command clears messages.
        Messages from a specific user can be cleared, but a user does not have to be specified.
        Perisison is locked to members with the master role.
			`,
      examples: ['clear 100'],
      args: [{
        key: 'amount',
        label: 'amount',
        prompt: 'How many messages would you like to clear? (Max is 100)',
        type: 'float',
        infinite: false
      }],

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

    msg.channel.bulkDelete(args.amount + 1)
      .then(crap => {
        msg.channel.send(`${msg.author}, :white_check_mark: **Cleared ${args.amount} messages.**`)
          .then(msg => {
            setTimeout(del, 5000)

            function del() {
              msg.delete(1)
            }
          })
      })
  }
};
