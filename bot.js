/* eslint-disable no-console */
const Commando = require('discord.js-commando');
const MisCord = require('./Modules/Client');
const path = require('path');
const oneLine = require('common-tags').oneLine;
const sqlite = require('sqlite');
const sqlite3 = require("sqlite3")
const express = require('express')
const mds = require('markdown-serve');
const app = express();
const port = 8080;

require('dotenv').config()
let config = {
	WEBHOOK_ID: process.env.WEBHOOK_ID,
	WEBHOOK_TOKEN: process.env.WEBHOOK_TOKEN,
	DISCORD_OWNER_ID: process.env.DISCORD_OWNER_ID,
	DISCORD_PREFIX: process.env.DISCORD_PREFIX
}
/** 
 * Initialise the Bots main Client Object 
 * */
const client = new MisCord({
	owner: config.DISCORD_OWNER_ID,
	commandPrefix: config.DISCORD_PREFIX
}, config);


//
// ─── HANDLE COMMON EVENTS ───────────────────────────────────────────────────────
//
client
	// Bot Online and waiting on Discord
	.on('ready', () => {
		// eslint-disable-next-line no-process-env
		if (process.env.ISBUILD === 'True') {
			console.log('Build Success...! Exiting...');
			process.exit(0);
		}
		client.logger.info(`[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`);
		// client.setInterval(() => {
		// 	const activity = activities[Math.floor(Math.random() * activities.length)];
		// 		if (client.settings.serverActivity) { client.user.setActivity(activity.text, { type: activity.type }); };
		// }, 60000);
	})
	// Bot Got Disconnected from Discord
	.on('disconnect', event => {
		client.logger.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
		process.exit(0);
	})
	// Bot raised an error
	.on('error', err => client.logger.error(err))
	// Bot raised a Warning
	.on('warn', warn => client.logger.warn(warn));
//
// ─── HANDLE COMMAND/GROUP EVENTS ────────────────────────────────────────────────
//
client
	.on('commandError', (command, err) => client.logger.error(`[COMMAND:${command.name}]\n${err.stack}`))
	.on('commandBlocked', (msg, reason) => {
		client.logger(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		client.logger(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		client.logger(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		client.logger(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	});



// Start handling message events
client.on('message', async message => {
	// Ignore our own Messages
	if (message.author.id === client.user.id) {
		return;
	}
	if (message.channel.type === 'group') {
		return;
	}
	// Ignore Bots
	if (message.author.bot) {
		return;
	}
	if (!message.guild) {
		return;
	}
	// Levels not in use
	//await client.levels.giveGuildUserExp(message.guild.members.get(message.author.id), message);
});

client
	.setProvider(sqlite.open({ filename: path.join(__dirname, "./data/settings.sqlite3"), driver: sqlite3.Database }).then(db => new Commando.SQLiteProvider(db)))
	.catch(client.logger);

client.registry
	.registerGroup('general', 'General')
	.registerGroup('servers', 'Servers')
	.registerGroup('whitelist', 'Whitelist')
	.registerDefaults()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(config.token).catch(err => {
	client.logger.error(err);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(
	mds.middleware({
		rootDirectory: path.resolve(__dirname, 'public'),
		view: 'markdown'
	})
);
app.listen(port, () => client.logger.info(`Example app listening on port ${port}!`));
