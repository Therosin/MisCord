const { Command } = require('discord.js-commando');

const Utils = require("../../util/BotUtils")
const Interop = require("../../Plugins/MiscreatedInterop")



const CommandAllowRoles = ["Miscord-User", "miscord-user"]

/**
 * Check we have a Valid array of players
 * @param {array} playersArray 
 */
function validPlayerArray(playersArray) {
    if (playersArray != undefined) {
        //TODO: We should realy check we actualy have players, not just that we jave a valid array
        return (playersArray && Array.isArray(playersArray))
    }
    return false
}

/**
 * Generate a player list Embed
 * @param {Object} server Current server Object
 * @param {string} message_text template message string
 * @param {Object} SteamWebApi reference to client steamwebapi object
 */

const genPlayerEntries = async (message_text) => {
    return message_text
};

const genPlayerList = (server, message_text, SteamWebApi) => {
    return new Promise(async (fulfill, reject) => {
        if (!server || !message_text) {
            // server and message_text are required
            reject("Invalid params")
        } else {
            // Check we have valid players
            if (validPlayerArray(server.playersArray)) {
                await genPlayerEntries(message_text)
                    .then(message_text => { fulfill(message_text) })
                    .catch(err => { reject(err) });
            }
        }
    })
};


module.exports = class MisServerInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'server-info',
            group: 'servers',
            memberName: 'server-info',
            description: 'get server-status for the specified serverId',
            examples: [
                `${client.commandPrefix} server-info e32dfw2`,
            ],
            guildOnly: true,
            args: [
                {
                    key: 'serverId',
                    prompt: 'enter the serverId to get info for',
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
        if (!serverId) { return message.say("You must specify a serverId to get info for.") }

        return new Promise(async (fulfill, reject) => {

            try {
                fulfill(
                    await this.client.MiscreatedServers.getServer(message.guild.id, { server_id: serverId }).then(res => {
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

    <:server:827461152904314911>  __ServerName__ ${server_status.name}
    > [ **ip**: ${server_status.ip} **version**: ${server_status.version} ]

    <:clockMC:827461114064928798>  __Server Time__ [ingame:${server_status.time}]
    > **UpTime**: ${server_status.upTime} **Restarting**: ${server_status.nextRestart}

    <:mapMC:827461059505160204>  __Map__
    > **Current Map**: ${server_status.level}    **gameRules** : ${server_status.gameRules}

    <:weather_cloudy:827460827439169587>  __Weather__
    > **Current**: ${server_status.weather} [weatherPattern: ${server_status.weatherPattern}]

    <:mouseMC:827461167026405386>  __Direct Connect__
    steam://run/299740/connect/+connect%20${result.server_ip}%20${result.server_gameport}

    <:antenna:827461128971747348>  __Players__                      [online : ${server_status.players}]

    <:svaltek:827467970707062834>
    `;
                        return genPlayerList(server_status, message_text, this.client.SteamWebApi).then(message_text_1 => {

                            let embed = Utils.generateSuccessEmbed(message_text_1, "Success fetching Server Info");
                            message.say(embed);
                        });
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