const { Command } = require('discord.js-commando');

const Utils = require("../../util/BotUtils")
const Interop = require("../../Plugins/MiscreatedInterop")

function genPlayerList(server, message_text,SteamWebApi) {
    return new Promise(async (fulfill, reject) => {
        if (!server || !message_text) { reject("Inavalid params") }
        if (server.playersArray && Array.isArray(server.playersArray)) {
            for (const player of server.playersArray) {
                let playerDetail = `\n > **Name**: ${player.name}    **SteamID**: ${player.steam}[ [rep](https://steamrep.com/search?q=${player.steam}) ]\n > **ping**: ${player.ping} **entity**: ${player.entID}`
                await SteamWebApi.getSteamProfile(player.steam).then(profile => {
                    if (profile) {
                        let communityVisability = "Unknown"
                        if (profile.visibilityState) {
                            if (profile.visibilityState === 1) { communityVisability = "Private" }
                            if (profile.visibilityState === 2) { communityVisability = "FriendsOnly" }
                            if (profile.visibilityState === 3) { communityVisability = "Public" }
                        }
                        playerDetail += `\n >    **SteamName**: [${profile.nickname}](${profile.url}) | **SteamPrivacy**:${communityVisability}`
                    }
                })
                message_text += playerDetail
            }
            fulfill(message_text)
        }
    })
}



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
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'serverId',
                    prompt: 'enter the serverId to get info for',
                    type: 'string',
                },
            ]
        });
    }

    async run(message, args) {
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

                            fulfill(await server.getStatus())
                        } catch (err) {
                            reject(err)
                        }
                    } else {
                        if (this.client.isDebugBuild) { console.log(result) };
                        reject(`Invalid ServerData Please remove and Re add server: ${serverId} \n _this shouldnt happen if you keep seeing this message please report it as a bug_`)
                    }

                })
                    //* Fetched ServerInfo
                    .then(server => {
                        if (server && server.name != undefined) {
                            //debugging
                            if (this.client.isDebugBuild) { console.log(result) };
                            let message_text = `
__ServerName__: ${server.name} \n[ ip: ${server.ip} version: ${server.version} ]
> **Current Map**: ${server.level}    **gameRules** : ${server.gameRules}

__Server Time__:                  [ingame:${server.time}]
> **UpTime**: ${server.upTime} **Restarting**: ${server.nextRestart}

__Weather__
> **Current**: ${server.weather} [weatherPattern: ${server.weatherPattern}]

__Players__:                      [online:${server.players}]`
                            return genPlayerList(server, message_text,this.client.SteamWebApi).then(message_text => {

                                let embed = Utils.generateSuccessEmbed(message_text, "Success fetching Server Info")
                                message.say(embed)
                            })
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