const { Command } = require('discord.js-commando');
const Utils = require("../../util/BotUtils")
const Interop = require("../../Plugins/MiscreatedInterop")

module.exports = class MisShowWhitelistCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'whitelist-show',
            group: 'whitelist',
            memberName: 'whitelist-show',
            description: 'display the current server whitelist',
            examples: [
                `${client.commandPrefix} whitelist-show e32dfw2`,
            ],
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'serverId',
                    prompt: 'enter the serverId to show the whitelist for',
                    type: 'string',
                    validate: serverId => {
                        if (serverId.length != 6 ) return 'invalid serverId';
                        return true
                    }
                },
            ]
        });
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
            .then(result => {

                //! Server with id `serverId` found
                return new Promise(async (fulfill, reject) => {
                    if (result && result.server_id) {
                        try {
                            let server = new Interop(result.server_ip, result.server_rconport, result.server_password)
                            // ensure we have a valid server object.
                            if (!server) { reject(`failed to create misrcon interface for server: ${serverId}`) }

                            fulfill(await server.getWhitelist())
                        } catch (err) {
                            reject(err)
                        }
                    } else {
                        console.log(result)
                        reject(`Invalid ServerData Please remove and Re add server: ${serverId} \n _this shouldnt happen if you keep seeing this message please report it as a bug_`)
                    }

                })
                    //* Fetched ServerInfo
                    .then(async whitelist => {
                        if (whitelist && Array.isArray(whitelist)) {
                            let message_text = `__Whitelist__\n`
                            if (whitelist.length >= 1) {
                                for (const steamId of whitelist) {
                                    await this.client.SteamWebApi.getSteamProfile(steamId).then(profile => {
                                        let playerDetail = `\n > **SteamId**: ${steamId} `
                                        if (profile) {
                                            let communityVisability = "Unknown"
                                            if (profile.visibilityState) {
                                                if (profile.visibilityState === 1) { communityVisability = "Private" }
                                                if (profile.visibilityState === 2) { communityVisability = "FriendsOnly" }
                                                if (profile.visibilityState === 3) { communityVisability = "Public" }
                                            }
                                            playerDetail += `\n >    **SteamName**: [${profile.nickname}](${profile.url}) | **SteamPrivacy**:${communityVisability}`
                                        }
                                        playerDetail += ` [ [rep](https://steamrep.com/search?q=${steamId}) ]\n`
                                        message_text += playerDetail
                                    })
                                }
                            } else {
                                message_text += "\n NO PLAYERS IN WHITELIST"
                            }
                            let embed = Utils.generateSuccessEmbed(message_text, "Success fetching Server Info")
                            message.say(embed)

                        } else {
                            let embed = Utils.generateFailEmbed(`Couldnt parse response from server`, "Failed to fetch Server Info!")
                            message.say(embed)
                        }

                    })
                    //! Couldnt fetch Server Info
                    .catch(err => {
                        let embed = Utils.generateFailEmbed(`Error fetching server info ${err}`, "Failed to fetch Server Info!")
                        message.say(embed)
                    })

            })
            .catch(err => {
                //! Server with id `serverId` Not found
                let embed = Utils.generateFailEmbed(`Server not found or Invalid serverId specified: ${err}`, "Failed!")
                message.say(embed)
            })
    }
};