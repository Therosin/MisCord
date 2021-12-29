#! /usr/bin/env node

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

const path = require('path');
const { ShardingManager } = require('discord.js');

require('dotenv').config({path:'.env.local'})
/* eslint-disable no-console */

const manager = new ShardingManager(path.join(__dirname, 'bot.js'), {
	token: process.env.DISCORD_TOKEN,
	totalShards: 1,
	shardArgs: {
		TIMEOUT: 120
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
	shard.Database = global.Database
});
manager.spawn().catch(console.error);

require('./apiserver').startServer()