const exec = require('child_process').exec;
const { CommandoClient } = require('discord.js-commando');
const { WebhookClient } = require('discord.js');
const winston = require('winston');
const MiscreatedServers = require('../Plugins/MiscreatedServers');
const SteamWebApi = require('../Plugins/SteamWebApi')
const MongoDatabase = require('../Database/MongoDB');
/**
 * Create an Instance of the MiscreatedTools plugin for the bot to use
 */


module.exports = class Miscord extends CommandoClient {
	constructor(options,config) {
		super(options);

		this.logger = winston.createLogger({
			transports: [new winston.transports.Console()],
			format: winston.format.combine(
				winston.format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
				winston.format.printf(log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`)
			)
		});
		this.webhook = new WebhookClient(config.WEBHOOK_ID, config.WEBHOOK_TOKEN, { disableEveryone: true });
		this.db = new MongoDatabase(this)
		this.MiscreatedServers = new MiscreatedServers(this)
		this.SteamWebApi = new SteamWebApi(this)
	}

	async ProcRestart() {
		await exec('pm2 restart sharder');
	}
};
