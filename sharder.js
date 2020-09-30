#!/usr/bin/env node
const path = require('path');
const { ShardingManager } = require('discord.js');
const config = require('./data/config.json');
const { TIMEOUT } = require('dns');

/* eslint-disable no-console */

const manager = new ShardingManager(path.join(__dirname, 'bot.js'), {
	token: config.token,
	totalShards: 1,
	shardArgs: {
		TIMEOUT: 45
	},
	respawn: true,
	mode: 'worker'
});

manager.on('shardCreate', shard => {
	console.log(`----- SHARD ${shard.id} LAUNCHED -----`);
	shard
		.on('death', () => console.log(`----- SHARD ${shard.id} DIED -----`))
		.on('ready', () => console.log(`----- SHARD ${shard.id} READY -----`))
		.on('disconnect', () => console.log(`----- SHARD ${shard.id} DISCONNECTED -----`))
		.on('reconnecting', () => console.log(`----- SHARD ${shard.id} RECONNECTING -----`));
});
manager.spawn().catch(console.error);
