const Commando = require('discord.js-commando');

class RequestCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'request',
			aliases: [],
			group: 'info',
			memberName: 'request',
			description: `Send in a suggestion/request!`,
			guildOnly: true
		});
	}
	async run(message) {
		const args = message.content.trim().split(/ +/g);
		const me = this.client.custconfig.OwnerID;

		if(!message.guild.me.hasPermission('SEND_MESSAGES')) {
			return message.author.send("I don't have permission to speak there!");
		} else if(!args[1]) {
			return message.say(
        `To properly use this command type in... "**${
          this.client.commandPrefix
        }request**" followed by what you would like to make a request for! For example, "**${
          this.client.commandPrefix
        }request** *new jokes!*" to send a request in for "*new jokes!*"`
      );
		} else {
			let request = args.slice(1).join(' ');
			let sendMe = this.client.fetchUser(me).then(user => {
				user.send(`<@${message.author.id}> has requested:\n*${request}*, please!`);
				message.say(`Your request for "${request}" has been sent in!`);
			});
		}
	}
}

module.exports = RequestCommand;
