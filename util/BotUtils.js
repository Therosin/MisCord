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


const crypto = require('crypto');
const { SUCCESS_EMOJI_ID } = process.env;
const yes = ['yes', 'y', 'ye', 'yeah', 'yup', 'yea', 'ya'];
const no = ['no', 'n', 'nah', 'nope', 'nop'];


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
		const bufStr = Buffer.from(str, 'utf8');
		return bufStr.toString('hex');
	}

	static hexDecode(str) {
		const bufStr = Buffer.from(str, 'hex');
		return bufStr.toString();
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

	static sendPagedEmbed = (message, pages) => {
		let page = 1;
		const embed = new MessageEmbed()
			.setColor(0xffffff) //sets color here
			.setFooter(`Page ${page} of ${pages.length}`)
			.setDescription(pages[page - 1])

		message.channel.send(embed).then(msg => {
			msg.react('⏪').then(r => {
				msg.react('⏩');
				//filters
				const isBackwards = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;
				const isForwards = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id;

				const backwards = msg.createReactionCollector(isBackwards);
				const forwards = msg.createReactionCollector(isForwards);

				backwards.on("collect", r => {
					if (page === 1) return;
					page--;
					embed.setDescription(pages[page - 1]);
					embed.setFooter(`Page ${page} of ${pages.length}`);
					msg.edit(embed)
				});

				forwards.on("collect", r => {
					if (page === pages.length) return;
					page++;
					embed.setDescription(pages[page - 1]);
					embed.setFooter(`Page ${page} of ${pages.length}`);
					msg.edit(embed)
				});
			});
		});
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

	/**
	 * Returns an array sliced into arrays of a given size.
	 *
	 * @param array {Array} array to split
	 * @param chunk_size {Integer} Size of every group
	 */
	static slicedArray(array, chunk_size) {
		var index = 0;
		var arrayLength = array.length;
		var tempArray = [];

		for (index = 0; index < arrayLength; index += chunk_size) {
			const current_chunk = array.slice(index, index + chunk_size);
			// Do something if you want with the group
			tempArray.push(current_chunk);
		}

		return tempArray;
	}

	static delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	static shuffle(array) {
		const arr = array.slice(0);
		for (let i = arr.length - 1; i >= 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
		}
		return arr;
	}

	static list(arr, conj = 'and') {
		const len = arr.length;
		return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
	}

	static shorten(text, maxLen = 2000) {
		return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
	}

	static randomRange(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static trimArray(arr, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		}
		return arr;
	}

	static firstUpperCase(text, split = ' ') {
		return text.split(split).map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ');
	}

	static formatNumber(number) {
		return Number.parseFloat(number).toLocaleString(undefined, { maximumFractionDigits: 2 });
	}

	static base64(text, mode = 'encode') {
		if (mode === 'encode') return Buffer.from(text).toString('base64');
		if (mode === 'decode') return Buffer.from(text, 'base64').toString('utf8') || null;
		throw new TypeError(`${mode} is not a supported base64 mode.`);
	}

	static hash(text, algorithm) {
		return crypto.createHash(algorithm).update(text).digest('hex');
	}

	static initialization_vector = "X05IGQ5qdBnIqAWD";

	static encrypt_data(data, key) {
		var cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(this.initialization_vector));
		var crypted = cipher.update(data, 'utf-8', 'hex');
		crypted += cipher.final('hex');
		return crypted;
	}

	static decrypt_data(data, key) {
		var decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(this.initialization_vector));
		var decrypted = decipher.update(data, 'hex', 'utf-8');
		decrypted += decipher.final('utf-8');
		return decrypted;
	}

	static today(timeZone) {
		const now = new Date();
		if (timeZone) now.setUTCHours(timeZone);
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		now.setMilliseconds(0);
		return now;
	}

	static tomorrow(timeZone) {
		const today = Util.today(timeZone);
		today.setDate(today.getDate() + 1);
		return today;
	}

	static async awaitPlayers(msg, max, min, { time = 30000, dmCheck = false } = {}) {
		const joined = [];
		joined.push(msg.author.id);
		const filter = res => {
			if (res.author.bot) return false;
			if (joined.includes(res.author.id)) return false;
			if (res.content.toLowerCase() !== 'join game') return false;
			joined.push(res.author.id);
			res.react(SUCCESS_EMOJI_ID || '✅').catch(() => null);
			return true;
		};
		const verify = await msg.channel.awaitMessages(filter, { max, time });
		verify.set(msg.id, msg);
		if (dmCheck) {
			for (const message of verify.values()) {
				try {
					await message.author.send('Hi! Just testing that DMs work, pay this no mind.');
				} catch (err) {
					verify.delete(message.id);
				}
			}
		}
		if (verify.size < min) return false;
		return verify.map(message => message.author);
	}

	static async verify(channel, user, time = 30000) {
		const filter = res => {
			const value = res.content.toLowerCase();
			return res.author.id === user.id && (yes.includes(value) || no.includes(value));
		};
		const verify = await channel.awaitMessages(filter, {
			max: 1,
			time
		});
		if (!verify.size) return 0;
		const choice = verify.first().content.toLowerCase();
		if (yes.includes(choice)) return true;
		if (no.includes(choice)) return false;
		return false;
	}
};
