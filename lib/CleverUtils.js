const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const moment = require('moment');

module.exports = class CleverUtils {
	static randomInt(low, high) {
    // eslint-disable-next-line no-mixed-operators
		return Math.floor(Math.random() * (high - low + 1) + low);
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
		return new MessageEmbed({
			title: title,
			description: description || '',
			timestamp: moment().format('LLL'),
			footer: {
        // eslint-disable-next-line camelcase
				icon_url: message.author.displayAvatarURL(),
				text: message.author.tag
			}
		});
	}

	static async getHelpText(guild) {
		const prefix = guild.commandPrefix || guild.client.commandPrefix;

    // eslint-disable-next-line no-unused-vars
		const info = await guild.client.getInfo();

		return stripIndents`**LEVEL SYSTEM**
        __Get current level__: \`${prefix}rank\`
        __View leaderboard__: \`${prefix}leaderboard\`
        
        **REWARDS**
        __List all rewards__: \`${prefix}rewards\`
        __Add new reward__: \`${prefix}reward add [role] [level]\`
        __Remove existing reward__: \`${prefix}reward remove [role]\`
                
        **OTHER**
        __Help__: \`${prefix}help\``;
	}
};
