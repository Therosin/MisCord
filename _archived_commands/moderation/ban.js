const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class BanCommand extends commando.Command {
	constructor(bot) {
		super(bot, {
			name: 'ban',
			aliases: ['remove', 'hardban'],
			group: 'moderation',
			memberName: 'ban',
			description: 'Bans a specified user.',
			details: oneLine`
				This command bans a specified user and prunes their messages for a specific amount of days.
        This command is the highest punishment, with no time limit.
        Permission is locked to members with the super role.
			`,
			examples: ['ban @Bob#1234 7 Being a butt'],
			args: [
				{
					key: 'user',
					label: 'user',
					prompt: 'What user would you like to ban? Please specify one only.',
					type: 'member',
					infinite: false
				},
				{
					key: 'prumedays',
					label: 'prunedays',
					prompt: 'How many days worth of messages should I delete? Default is 0',
					type: 'float',
					default: '0',
					infinite: false
				},
				{
					key: 'reason',
					label: 'reason',
					prompt: 'Why is the user being banned?',
					type: 'string',
					infinite: false
				}
			],

			guildOnly: true,

			guarded: true
		});
	}

	async run(msg, args) {
		let allowed = msg.guild.settings.get('superrole');
		if(!allowed) {
			return msg.reply(
        ':warning: **This command is not set up to work!** Have your server owner run the setup command.'
      );
		}
		if(!msg.member.roles.has(allowed)) return msg.reply(':warning: **You do not have permission to use this command!**');

		if(!msg.guild.member(this.client.user).hasPermission('BAN_MEMBERS')) return msg.reply(':warning: **I do not have permission to ban members!**');

		await args.user.send(`You have been banned from the server '${msg.guild}'!
Staff member: ${msg.author.username}
Reason: '${args.reason}'`);
		msg.channel.send(
      `Science isn't about WHY. It's about WHY NOT. Why is so much of our science dangerous? Why not marry safe science if you love it so much. In fact, why not invent a special safety door that won't hit you on the butt on the way out, because you are fired, ${
        args.user
      } Yes, you. Box. Your stuff. Out the front door. Parking lot. Car. Goodbye.`
    );

		msg.guild.ban(args.user, {
			days: args.prunedays,
			reason: args.reason
		});
	}
};
