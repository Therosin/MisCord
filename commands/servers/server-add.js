const { Command } = require('discord.js-commando');
const Utils = require("../../util/BotUtils")
const pQueue = require('../../util/pQueue')

module.exports = class MisAddServerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'server-add',
			group: 'servers',
			memberName: 'server-add',
			description: 'configures miscreated server connections and authorisation',
			examples: ['server-add', 'server-add localhost 64090 64094 rconpass1 c3cecio3ceciojci2o3cceoij <- you must use this format if you want the messege to be autodeleted from chat'],
			guildOnly: true,
			userPermissions: ['ADMINISTRATOR'],
			argsPromptLimit: 0,
			args: [
				{
					key: 'ip',
					default: "",
					prompt: "",
					type: 'string',
				},
				{
					key: 'name',
					default: "",
					prompt: "",
					type: 'string',
				},
				{
					key: 'gameport',
					default: "",
					prompt: "",
					type: 'string',
				},
				{
					key: 'rconport',
					default: "",
					prompt: "",
					type: 'string',
				},
				{
					key: 'password',
					default: "",
					prompt: "",
					type: 'string',
				},
				{
					key: 'authkey',
					default: "",
					prompt: "",
					type: 'string',
				},
			],

		});
	}

	async run(message, args) {
		const client = this.client

		/**
		 * Create a temporary `server` object for the entered parameters all are require
		 */

		const Continue = (server) => {
			const run = new Promise(async (fulfill, reject) => {
				await client.MiscreatedServers.addServer(message.guild.id, server)
					.then(result => { fulfill(result) })
					.catch(err => { reject(err) })
			}).then(result => {
				//! Server Created
				let embed = Utils.generateSuccessEmbed(`Server added, ID: ${result}`, "Create Server, OK!!")
				message.say(embed)
			}).catch(err => {
				//! Failed to Create server
				let embed = Utils.generateFailEmbed(`Failed to add Server: ${err}`, "Create Server Failed!")
				message.say(embed)
			}).finally(() => {
				setTimeout(() => {
					message.delete()
				}, 500);
			})
			return run
		}

		const GenServerData = async (args) => {
			let server = {}

			let ip_response
			if (args.ip === "") {
				const ip_prompt = 'please enter the servers ip or hostname, eg:server1';
				ip_response = await Utils.awaitReply(message, ip_prompt, 40000, true)
			}
			server.ip = ip_response || args.ip

			let name_response
			if (args.name === "") {
				const name_prompt = 'please enter the servers name (for your own reference, spaces ARE allowed but you  must wrap the name in doublequotes), eg:server1';
				name_response = await Utils.awaitReply(message, name_prompt, 40000, true)
			}
			server.name = name_response || args.name

			let gameport_response
			if (args.gameport === "") {
				const gameport_prompt = 'please enter the servers gameport, eg:64090';
				gameport_response = await Utils.awaitReply(message, gameport_prompt, 40000, true)
			}
			server.gameport = gameport_response || args.gameport;

			let rconport_response
			if (args.rconport === "") {
				const rconport_prompt = 'please enter the servers rconport, eg:64094';
				rconport_response = await Utils.awaitReply(message, rconport_prompt, 40000, true)
			}
			server.rconport = rconport_response || args.rconport

			let password_response
			if (args.password === "") {
				const password_prompt = 'please enter the servers rcon password';
				password_response = await Utils.awaitReply(message, password_prompt, 40000, true)
			}
			server.password = password_response || args.password

			let authkey_response
			if (args.authkey === "") {
				const authkey_prompt = 'please enter the servers authkey, eg:we1162e243ekose5o';
				authkey_response = await Utils.awaitReply(message, authkey_prompt, 40000, true)
			}
			server.authkey = authkey_response || args.authkey;

			return server
		}

		const server = await GenServerData(args)
		Continue(server)
	}

}