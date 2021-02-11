/* eslint-disable new-cap */
const { MessageEmbed } = require('discord.js');

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
};
