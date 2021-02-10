/* eslint-disable no-console */

// Bot Dependancies
const MisCord = require('./Modules/Client');
const MongoDBProvider = require('commando-provider-mongo').MongoDBProvider;
const { connection } = require('mongoose')
const db = connection

// General
const path = require('path');
const oneLine = require('common-tags').oneLine;
const Utils = require('./util/BotUtils')



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
		client.setInterval(() => {
			client.MiscreatedServers.getServerCount().then((serverCount) => {
				Utils.getAllGuildsCount(client).then((guildCount) => {
					client.user.setPresence({
						status: 'idle',
						activity: {
							name: `Miscreated ${client.commandPrefix}help |S:${serverCount}/G:${guildCount}`,
							type: `PLAYING`,
						}
					}).catch((err) => { client.logger.error(err) })
				})
			}).catch((err) => {
				client.logger.error(err)
			})
		}, 60000);

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
		client.logger.error(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		client.logger.info(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		client.logger.info(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		client.logger.info(oneLine`
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

client.registry
	.registerGroup('general', 'General')
	.registerGroup('servers', 'Servers')
	.registerGroup('whitelist', 'Whitelist')
	.registerGroup('banlist', 'Banlist')
	.registerDefaults()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(config.token).catch(err => {
	client.logger.error(err);
});
