const { Command } = require('discord.js-commando');
const Utils = require("../../Modules/BotUtils")

module.exports = class MisAddServerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'server-add',
			group: 'servers',
			memberName: 'server-add',
			description: 'configures miscreated server connections and authorisation',
			examples: ['server-add', 'server-add localhost 64090 64094 rconpass1 c3cecio3ceciojci2o3cceoij'],
			guildOnly: true,
			userPermissions: ['ADMINISTRATOR'],
			args: [
				{
					key: 'ip',
					prompt: 'please enter the servers ip or hostname',
					type: 'string',
				},
				{
					key: 'name',
					prompt: 'please enter the servers name (for your own reference, no spaces), eg:server1',
					type: 'string',
				},
				{
					key: 'gameport',
					prompt: 'please enter the servers gameport, eg:64090',
					type: 'string',
				},
				{
					key: 'rconport',
					prompt: 'please enter the servers rconport, eg:64094',
					type: 'string',
				},
				{
					key: 'password',
					prompt: 'please enter the servers rcon password',
					type: 'string',
				},
				{
					key: 'authkey',
					prompt: 'please enter the servers authkey, eg:we1162e243ekose5o',
					type: 'string',
					required: true
				},
			],
		});
	}

	async run(message, args) {
		/**
		 * Create a temporary `server` object for the entered parameters all are require
		 */

		let server_id = Math.random().toString(36).slice(-6);
		let server = {
			"id": server_id,
			"name": args.name,
			"ip": args.ip,
			"gameport": args.gameport,
			"rconport": args.rconport,
			"password": args.password,
			"authkey": args.authkey
		}

		return new Promise(async (fulfill, reject) => {
			try {
				fulfill(await this.client.MiscreatedServers.addServer(message.guild.id, server))
			} catch (err) {
				reject(err)
			}
		}).then(result => {
			//! Server Created
			let embed = Utils.generateSuccessEmbed(`Server added, ID: ${server_id}!`, "Create Server, OK!!", result)
			message.say(embed)
		}).catch(err => {
			//! Failed to Create server
			let embed = Utils.generateFailEmbed(`Failed to add Server: ${err}`, "Create Server Failed!")
			message.say(embed)
		})
	}
}