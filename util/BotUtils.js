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


/* eslint-disable new-cap */

const { MessageEmbed } = require("discord.js");

module.exports = class BotUtils {

	static getAllGuildsCount = async (client) => {
		// get guild collection size from all the shards
		const req = await client.shard.fetchClientValues('guilds.cache.size');

		// return the added value
		return req.reduce((p, n) => p + n, 0);
	}

	static randomInt(low, high) {
		// eslint-disable-next-line no-mixed-operators
		return Math.floor(Math.random() * (high - low + 1) + low);
	}

	static hexEncode(str) {
		var hex, i;

		var result = "";
		for (i = 0; i < str.length; i++) {
			hex = str.charCodeAt(i).toString(16);
			result += ("000" + hex).slice(-4);
		}

		return result
	}

	static hexDecode(str) {
		var j;
		var hexes = str.match(/.{1,4}/g) || [];
		var back = "";
		for (j = 0; j < hexes.length; j++) {
			back += String.fromCharCode(parseInt(hexes[j], 16));
		}

		return back;
	}

	static StringPadding(pad, str, padLeft) {
		if (typeof str === 'undefined')
			return pad;
		if (padLeft) {
			return (pad + str).slice(-pad.length);
		} else {
			return (str + pad).substring(0, pad.length);
		}
	}

	static generateSuccessEmbed(message, title, description) {
		return this.generateEmbed(message, title, description).setColor(0x8ed938);
	}

	static generateFailEmbed(message, title, description) {
		return this.generateEmbed(message, title, description).setColor(0xec3c42);
	}

	static generateInfoEmbed(message, title, description) {
		return this.generateEmbed(message, title, description).setColor(0x389ed9);
	}

	static generateEmbed(message, title, description) {
		let embed = new MessageEmbed()
			.addField(`__**${title}.**__`, `${message}`)
		if (description != undefined) {
			embed.addField("info:", `_ ${description}_`)
		}
		return embed
	}

	/**
	 *  SINGLE- LINE AWAITMESSAGE
	 *  A simple way to grab a single reply, from the user that initiated
	 *  the command.Useful to get "precisions" on certain things...
	 *  USAGE
	 *  const [response,deleted,err] = await client.awaitReply(msg, "Favourite Color?",true);
	 *  if (!deleted){ console.error(`failed to delete response ${err}`)}
	 *  msg.reply(`Oh, I really love ${response} too!`);
	*/
	static async awaitReply(msg, question, limit = 60000, deleteReply) {
		const filter = m => m.author.id === msg.author.id;
		let prompt = await msg.channel.send(question);
		try {
			const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
			const content = collected.first().content
			if (deleteReply) {
				collected.first().delete()
				prompt.delete()
			}
			return content;
		} catch (e) {
			return false;
		}
	};

	/**
	 *  MESSAGE CLEAN FUNCTION
	 *  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
	 *  escaped so they're shown more easily. As a bonus it resolves promises
	 *  and stringifies objects!
	 *  This is mostly only used by the Eval and Exec commands.
	*/
	static async message_clean(client, text) {
		if (text && text.constructor.name == "Promise")
			text = await text;
		if (typeof text !== "string")
			text = require("util").inspect(text, { depth: 1 });

		text = text
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203))
			.replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

		return text;
	};

};
