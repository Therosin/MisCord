const Commando = require('discord.js-commando');

class SayCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'say',
			aliases: ['copyme', 'repeat', 'echo'],
			group: 'servers',
			memberName: 'say',
			description: ` repeat after you.`,
			guildOnly: true,
			clientPermissions: ['MANAGE_MESSAGES']
		});
	}
	run(message) {
		const args = message.content.trim().split(/ +/g);

		if(!message.guild.me.hasPermission('SEND_MESSAGES')) {
			return message.author.send("I don't have permission to speak there!");
		} else if(!message.guild.me.hasPermission('MANAGE_MESSAGES')) {
			return message
        .say('I need to have "manage message" permissions to use this command.')
        .then(msg => msg.delete(5000))
        .catch();
		} else if(!message.member.hasPermission('ADMINISTRATOR')) {
			return message
        .say('You need to have administrator permissions to use this command.')
        .then(msg => msg.delete(5000))
        .catch();
		} else {
			let sayMessage = args.slice(1).join(' ');

			message.delete();
			return message.say(sayMessage);
		}
	}
}

module.exports = SayCommand;
