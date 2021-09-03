const { Command } = require('discord.js-commando');

const Utils = require("../../util/BotUtils")
const Interop = require("../../Plugins/MiscreatedInterop")


/** COMMAND AVAILABLE FOR ANYONE --  Pitiviers 08/20/21
const CommandAllowRoles = ["Miscord-User", "miscord-user"]
*/

module.exports = class MisServerInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'server-status',
            group: 'servers',
            memberName: 'server-status',
            description: 'get lightened server status for the specified serverId - for public use',
            examples: [
                `${client.commandPrefix} server-status e32dfw2`,
            ],
            guildOnly: true,
            args: [
                {
                    key: 'serverId',
                    prompt: 'enter the serverName or serverId to get info for',
                    type: 'string',
                    // validate: serverId => {
                    //     if (serverId.length != 6) return 'invalid serverId';
                    //     return true
                    // }
                },
            ]
        });
    }

    /** COMMAND AVAILABLE FOR ANYONE --  Pitiviers 08/20/21
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
    */

    async run(message, args) {
        message.delete();
        let serverId = args.serverId
        if (!serverId) { return message.say("You must specify serverName or serverId to get info for.") }

        return new Promise(async (fulfill, reject) => {

            try {
                fulfill(
                    await this.client.MiscreatedServers.getServer(message.guild.id, { server_id: serverId }).then(res => {
                        return res
                    })
                    ||
                    await this.client.MiscreatedServers.getServer(message.guild.id, { server_name: serverId }).then(res => {
                        return res
                    })
                )
            } catch (err) {
                reject(err)
            }
        })
            .then(async result => {
                try {
                    const server_status = await new Promise(async (fulfill, reject) => {
                        if (result && result.server_id) {
                            try {
                                let server = new Interop(result.server_ip, result.server_rconport, result.server_password);
                                // ensure we have a valid server object.
                                if (!server.server) { reject(`failed to create misrcon interface for server: ${serverId}`); }

                                fulfill(await server.getStatus());
                            } catch (err) {
                                reject(err);
                            }
                        } else {
                            if (this.client.isDebugBuild) { console.log(result); };
                            reject(`Invalid ServerData Please remove and Re add server: ${serverId} \n _this shouldnt happen if you keep seeing this message please report it as a bug_`);
                        }

                    });
                    if (server_status && server_status.name != undefined) {
                        //debugging
                        if (this.client.isDebugBuild) { console.log(server_status); };
                        let message_text = `
<:svaltek:827467970707062834>

<:server:827461152904314911>  **${server_status.name}**

<:weather_cloudy:827460827439169587>  **Weather :** ${server_status.weather}

<:clockMC:827461114064928798>  **Ingame time :** ${server_status.time}

<:warningMC:827460865941831690>  **Restarting in :** ${server_status.nextRestart}

<:antenna:827461128971747348>  **Players online :** ${server_status.players}

<:mouseMC:827461167026405386>  **Direct Connect :**
> steam://run/299740/connect/+connect%20${result.server_ip}%20${result.server_gameport}

<:antenna:827461128971747348>  __Players__ : [online : ${server_status.players}]

<:svaltek:827467970707062834>
                        `;



                        let embed = Utils.generateSuccessEmbed(message_text, "Success fetching Server Info");
                        message.say(embed);


                    } else {
                        let embed_1 = Utils.generateFailEmbed(`Couldnt parse response from server`, "Failed to fetch Server Info!");
                        message.say(embed_1);
                    }
                } catch (err_1) {
                    let embed_2 = Utils.generateFailEmbed(`Error fetching server info ${err_1}`, "Failed to fetch Server Info!");
                    message.say(embed_2);
                }
            })
            .catch(err => {
                //! Server with id `serverId` Not found
                let embed = Utils.generateFailEmbed(`Server not found or Invalid serverId specified: ${err}`, "Failed!")
                message.say(embed)
            });
    }
};