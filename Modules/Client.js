// Copyright (C) 2021 Theros @[MisModding|SvalTek]
// 
// This file is part of MisCord.
// 
// MisCord is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// MisCord is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with MisCord.  If not, see <http://www.gnu.org/licenses/>.



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

		this.isDebugBuild = false
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
		// Holds a reference to the main SvalTek Discord
		this.supportGuild = this.guilds.cache.get('588187481971621888')
	}

	async ProcRestart() {
		await exec('pm2 restart sharder');
	}
};
