const { Command } = require('discord.js-commando');
const Utils = require("../../util/BotUtils")

module.exports = class MisServerListCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'server-list',
            group: 'servers',
            memberName: 'server-list',
            description: 'lists configured miscreated server connections',
            examples: [
                `${client.commandPrefix} server-list`,
            ],
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
        });
    }

    async run(message) {
        message.delete();

        return new Promise(async (fulfill, reject) => {
            try {
                fulfill(await this.client.MiscreatedServers.getServers(message.guild.id))
            } catch (err) {
                reject(err)
            }
        }).then(data => {
            let embed
            if (data == undefined || data.length < 1) {
                embed = Utils.generateFailEmbed("No Configured servers", "No Servers", "no servers have been configured, add some with server-add")
            } else {
                let text = ""
                data.forEach(server => {
                    let line = `\n  [__**Name**__]: ${server.server_name} | [id]: ${server.server_id}\n [**hostname/ip**]: ${server.server_ip}\n [**gameport**]: ${server.server_gameport} | [**rconport**]: ${server.server_rconport}\n`
                    text = text + line
                });

                embed = Utils.generateSuccessEmbed(text, "Server List")
            }
            message.say(embed)
        }).catch(err => {
            let embed = Utils.generateFailEmbed(`Failed fetching servers: ${err}`, "Failed!")
            message.say(embed)
        })
    }
};