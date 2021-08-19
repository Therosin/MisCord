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




const crypto = require('crypto');
const { SUCCESS_EMOJI_ID } = process.env;
const yes = ['yes', 'y', 'ye', 'yeah', 'yup', 'yea', 'ya'];
const no = ['no', 'n', 'nah', 'nope', 'nop'];

module.exports = class Util {
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
