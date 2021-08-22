const { Command } = require('discord.js-commando');

const Utils = require("../../util/BotUtils")
const Interop = require("../../Plugins/MiscreatedInterop");


const CommandAllowRoles = ["Miscord-User", "miscord-user"]

module.exports = class MisServerRestartCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'server-restart',
            group: 'servers',
            memberName: 'server-restart',
            description: 'send a restart request to the specified server, defaults to restart in 1min',
            examples: [
                `${client.commandPrefix} server-restart [serverId] [restartTime_minutes] [message]`,
                `${client.commandPrefix} server-restart e32dfw2`,
                `${client.commandPrefix} server-restart e32dfw2 5`,
                `${client.commandPrefix} server-restart e32dfw2 5 "restarting in 5 minutes due to mod updates"`,
            ],
            guildOnly: true,
            args: [
                {
                    key: 'serverId',
                    prompt: 'enter the serverId to restart',
                    type: 'string',
                    validate: serverId => {
                        if (serverId.length != 6) return 'invalid serverId';
                        return true
                    }
                },
                {
                    key: 'restartTime',
                    prompt: 'how long until restart (minutes: defaults to 1)',
                    default: "1",
                    type: 'string'
                },
                {
                    key: 'restartMessage',
                    prompt: 'enter a Message to Announce or nothing to Skip - server will still send the usual announcements, use this to give players a reason.',
                    default: "",
                    type: 'string',
                }
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
        let restartTime = args.restartTime
        let restartMessage = args.restartMessage
        if (!serverId) { return message.say("You must specify a serverId to restart.") }

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

                //! Server with id `serverId` found
                try {
                    const Interop_Result = await new Promise(async (fulfill, reject) => {
                        if (result && result.server_id) {
                            try {
                                let server = new Interop(result.server_ip, result.server_rconport, result.server_password);
                                // ensure we have a valid server object.
                                if (!server.server) { reject(`failed to create misrcon interface for server: ${serverId}`); }

                                fulfill(await server.restartServer(restartTime, restartMessage));
                            } catch (err) {
                                reject(err);
                            }
                        } else {
                            if (this.client.isDebugBuild) { console.log(result); };
                            reject(`Invalid ServerData Please remove and Re add server: ${serverId} \n _this shouldnt happen if you keep seeing this message please report it as a bug_`);
                        }

                    });
                    if (Interop_Result) {
                        //debugging
                        if (this.client.isDebugBuild) { console.log(Interop_Result); };
                        let embed = Utils.generateSuccessEmbed(Interop_Result, "restart requested!");
                        message.say(embed);
                    }
                } catch (restart_error) {
                    let fail_embed = Utils.generateFailEmbed(`${restart_error}`, "Error in Restart Request!");
                    message.say(fail_embed);
                }

            })
            .catch(err => {
                //! Server with id `serverId` Not found
                let embed = Utils.generateFailEmbed(`Server not found or Invalid serverId specified: ${err}`, "Failed!")
                message.say(embed)
            })
    }
};