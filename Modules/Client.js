const exec = require('child_process').exec;
const { CommandoClient } = require('discord.js-commando');
const { WebhookClient } = require('discord.js');
const winston = require('winston');
const config = require('../data/config.json');
const database = require('./Database')
const MiscreatedServers = require('../Plugins/MiscreatedServers')
/**
 * Create an Instance of the MiscreatedTools plugin for the bot to use
 */


module.exports = class Miscord extends CommandoClient {
	constructor(options) {
		super(options);

		this.logger = winston.createLogger({
			transports: [new winston.transports.Console()],
			format: winston.format.combine(
				winston.format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
				winston.format.printf(log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`)
			)
		});
		this.webhook = new WebhookClient(config.WebhookID, config.WebhookTOKEN, { disableEveryone: true });
		this.database = new database(this)
		this.MiscreatedServers = new MiscreatedServers(this)
	}

	async ProcRestart() {
		await exec('pm2 restart sharder');
	}
};
