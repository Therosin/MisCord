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


const { Command } = require('discord.js-commando');
const Interop = require("../Plugins/MiscreatedInterop");

module.exports = class MiscordCommand extends Command {
	constructor(client, info) {
		super(client, info);

		this.argsSingleQuotes = info.argsSingleQuotes || false;
		this.throttling = info.throttling || { usages: 1, duration: 2 };

		/**
		 * Should this be a `Protected` command
		 * if true then only roles specified in CommandAllowedRoles
		 * will be able to run this command (bot owner can allways run all commands)
		 */
		this.protectedCommand = info.protectedCommand || false;

		/**
		 * Array containing Roles allowed to use this command
		 * by defalt this is set to `["Miscord-User", "miscord-user"]`
		 */
		this.CommandAllowedRoles = info.CommandAllowedRoles || []
	}

	hasPermission(msg) {
		msg.delete();
		// shoud we check authorisation for this command
		if (this.protectedCommand) {
			// Allways allow Owner
			if (this.client.isOwner(msg.author)) {
				return true
			};
			// Check Member Roles
			if (msg.member.roles.cache.some(r => this.CommandAllowedRoles.includes(r.name))) {
				return true
			}
			// Else Return Generic Fail
			return "You do not Have Permission to Use this Command"
		} else {
			// not protected
			return true
		}
	}

	async getServerforGuild(guildId, serverNameOrId) {
		if (!serverNameOrId) { return message.say("You must specify a serverId to manage whitelist for.") }

		return new Promise(async (fulfill, reject) => {
			try {
				fulfill(
					await this.client.MiscreatedServers.getServer(guildId, { server_id: serverNameOrId }).then(res => {
						return res
					})
					||
					await this.client.MiscreatedServers.getServer(guildId, { server_name: serverNameOrId }).then(res => {
						return res
					})
				)
			} catch (err) {
				reject(err)
			}
		})
	}
};

