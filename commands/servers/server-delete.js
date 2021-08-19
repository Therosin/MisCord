const { Command } = require('discord.js-commando');
const Utils = require("../../util/BotUtils")

const CommandAllowRoles = ['Miscord-User', 'miscord-user']

module.exports = class MisDeleteServerCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'server-delete',
            group: 'servers',
            memberName: 'server-delete',
            description: 'removes a configured miscreated server connections',
            examples: [
                `${client.commandPrefix} server-delete e32dfw2`,
            ],
            guildOnly: true,
            args: [
                {
                    key: 'serverId',
                    prompt: 'enter the serverId to delete',
                    type: 'string',
                    validate: serverId => {
                        if (serverId.length != 6) return 'invalid serverId';
                        return true
                    }
                },
            ]
        });
    }

    hasPermission(msg) {
        if (this.client.isOwner(msg.author)) {
            return true
        };

        if (msg.member.roles.cache.some(r => CommandAllowRoles.includes(r.name))) {
            return true
        } else {
            return "You do not Have Permission to Use this Command"
        }
    }

    async run(message, args) {
        message.delete();
        let serverId = args.serverId
        if (!serverId) { return message.say("serverId is required!") }

        return new Promise(async (fulfill, reject) => {
            try {
                fulfill(await this.client.MiscreatedServers.delServer(message.guild.id, serverId))
            } catch (err) {
                reject(err)
            }
        }).then(result => {
            //! Server Deleted
            let embed = Utils.generateSuccessEmbed(`Server: ${serverId} Deleted!`, "Success!")
            message.say(embed)
        }).catch(err => {
            //! Failed to delete server
            let embed = Utils.generateFailEmbed(`Server deletion failed: ${err}`, "Failed!")
            message.say(embed)
        })
    }
};