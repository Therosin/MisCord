const { Command } = require('discord.js-commando');
const Utils = require("../../util/BotUtils")


const CommandAllowRoles = ["Miscord-User", "miscord-user"]


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
            guildOnly: true
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

    async run(message) {
        message.delete();

        return new Promise(async (fulfill, reject) => {
            try { // try to find servers based on the callers guild
                fulfill(await this.client.MiscreatedServers.getServers(message.guild.id))
            } catch (err) {
                reject(err)
            }
        })
            .then(data => { // Verify we got some servers back from the db
                let embed
                if (data == undefined || data.length < 1) { // We recieved no Servers. show a message hinting to add some incase miscords a fresh invite.
                    embed = Utils.generateFailEmbed("No Configured servers", "No Servers", "no servers have been configured, add some with server-add")
                } else {
                    // try to build a list out of the returned servers and send them back in a nice embed
                    let text = ""
                    data.forEach(server => {
                        let line = `\n <:server:827461152904314911> [**Name**]: ${server.server_name} | [**id**]: ${server.server_id}\n [**hostname/ip**]: ${server.server_ip}\n [**gameport**]: ${server.server_gameport} | [**rconport**]: ${server.server_rconport}\n`
                        text = text + line
                    });

                    embed = Utils.generateSuccessEmbed(text, "Server List")
                }
                message.say(embed)
            })

            .catch(err => { // Something went wrong . just return the error directly for bug reporting.
                let embed = Utils.generateFailEmbed(`Failed fetching servers: ${err}`, "Failed!")
                message.say(embed)
            })
    }
};