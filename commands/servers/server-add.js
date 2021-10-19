const { Command } = require('discord.js-commando');
const Utils = require('../../util/BotUtils');
const { isBlankString, awaitReply } = require('../../util/BotUtils');

const CommandAllowRoles = ["Miscord-User", "miscord-user"]

module.exports = class MisAddServerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'server-add',
			group: 'servers',
			memberName: 'server-add',
			description: 'configures miscreated server connections and authorisation',
			examples: ['server-add', 'server-add localhost 64090 64094 rconpass1 c3cecio3ceciojci2o3cceoij <- you must use this format if you want the messege to be autodeleted from chat'],
			guildOnly: true,
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


	hasPermission(msg) {
		if (this.client.isOwner(msg.author)) {
			return true
		};

		if (msg.member.roles.cache.some(r => CommandAllowRoles.includes(r.name))) {
			return true
		} else {
			return "You do not Have Permission to Use this Command"
		}
	}


	async run(message, args) {
		let user_canceled = false
		let server_info = {
			"ip": args.ip,
			"name": args.name,
			"gameport": args.gameport,
			"rconport": args.rconport,
			"password": args.password,
			"authkey": args.authkey,
		}

		const CollectServerData = async () => {
			let ip_response
			if (isBlankString(server_info.ip)) {
				const ip_prompt = 'please enter the servers ip or hostname, eg:server1';
				ip_response = await awaitReply(message, ip_prompt, 40000, true)
			}
			if (ip_response === 'cancel') {
				user_canceled = true
				return server_info, user_canceled
			}
			server_info.ip = ip_response

			let name_response
			if (isBlankString(server_info.name)) {
				const name_prompt = 'please enter the servers name (for your own reference, spaces ARE allowed but you  must wrap the name in doublequotes), eg:server1';
				name_response = await awaitReply(message, name_prompt, 40000, true)
			}
			if (name_response === 'cancel') {
				user_canceled = true
				return server_info, user_canceled
			}
			server_info.name = name_response

			let gameport_response
			if (isBlankString(server_info.gameport)) {
				const gameport_prompt = 'please enter the servers gameport, eg:64090';
				gameport_response = await awaitReply(message, gameport_prompt, 40000, true)
			}
			if (gameport_response === 'cancel') {
				user_canceled = true
				return server_info, user_canceled
			}
			server_info.gameport = gameport_response

			let rconport_response
			if (isBlankString(server_info.rconport)) {
				const rconport_prompt = 'please enter the servers rconport, eg:64094';
				rconport_response = await awaitReply(message, rconport_prompt, 40000, true)
			}
			if (rconport_response === 'cancel') {
				user_canceled = true
				return server_info, user_canceled
			}
			server_info.rconport = rconport_response

			let password_response
			if (isBlankString(server_info.password)) {
				const password_prompt = 'please enter the servers rcon password';
				password_response = await awaitReply(message, password_prompt, 40000, true)
			}
			if (password_response === 'cancel') {
				user_canceled = true
				return server_info, user_canceled
			}
			server_info.password = password_response

			let authkey_response
			if (isBlankString(server_info.authkey)) {
				const authkey_prompt = 'please enter the servers authkey, eg:we1162e243ekose5o';
				authkey_response = await awaitReply(message, authkey_prompt, 40000, true)
			}
			if (authkey_response === 'cancel') {
				user_canceled = true
				return server_info, user_canceled
			}
			server_info.authkey = authkey_response
			return server_info, user_canceled
		}


		const ValidServerData = () => {
			let isValid = true

			for (let [key, value] of Object.entries(server_info)) {
				console.log(`add- server validation ${key} = ${value} `)
				if (isBlankString(value)) {
					console.log(`invalid option: ${key} `)
					isValid = false
				}
			}

			return isValid
		}

		const Continue = (server) => {
			const run = new Promise(async (fulfill, reject) => {
				await this.client.MiscreatedServers.addServer(message.guild.id, server)
					.then(result => { fulfill(result) })
					.catch(err => { reject(err) })
			})

				.then(result => {
					//! Server Created
					let embed = Utils.generateSuccessEmbed(`Server added, ID: ${result} `, "Create Server, OK!!")
					message.say(embed)
				})

				.catch(err => {
					//! Failed to Create server
					let embed = Utils.generateFailEmbed(`Failed to add Server: ${err} `, "Create Server Failed!")
					message.say(embed)
				})

				.finally(() => {
					setTimeout(() => {
						message.delete()
					}, 500);
				})
			return run
		}

		while (user_canceled === false) {
			server_info, user_canceled = await CollectServerData()
			if (user_canceled === true) {
				message.say("Ok, Cancelled.")
				setTimeout(() => {
					message.delete()
				}, 1600);
				break;
			} else {
				if (ValidServerData(server_info)) {
					Continue(server_info)
					break;
				}
			}
		}
	}
}
