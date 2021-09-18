const Command = require("../../Modules/Command");
const Utils = require("../../util/BotUtils")


module.exports = class MisAddWhitelistCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'whitelist-add',
            group: 'whitelist',
            memberName: 'whitelist-add',
            description: 'adds whitlisted steamId for the specified serverId',
            examples: [
                `${client.commandPrefix} whitelist-add e32dfw2 710232182323`,
            ],
            guildOnly: true,
            args: [
                {
                    key: 'serverId',
                    prompt: 'enter the serverId to manage whitelisting for',
                    type: 'string',
                    validate: serverId => {
                        if (serverId.length != 6) return 'invalid serverId';
                        return true
                    }
                },
                {
                    key: 'steamId',
                    prompt: 'enter the steam64Id to whitelist',
                    type: 'string',
                }
            ],
            protectedCommand: true,
            CommandAllowedRoles: ["Miscord-User", "miscord-user"],
        });
    }

    async run(message, args) {
        //Needed Vars
        const
            serverId = args.serverId,
            steamId = args.steamId,
            guildId = message.guild.id;

        //fetch server
        return await this.getServerforGuild(guildId, serverId)
            .then(async server => {
                //! Server with id `serverId` found
                server.whitelistPlayer(steamId,this.client.isDebugBuild)
                    .then((whitelist_added, result) => {
                        let embed
                        if (this.client.isDebugBuild) {
                            console.log({
                                'serverId': serverId,
                                'steamId': steamId,
                                'guildId': guildId,
                                'whitelist_added': whitelist_added,
                                'result': result
                            });
                        };

                        if (whitelist_added) {
                            embed = Utils.generateSuccessEmbed(result, "Edit Whitelist: Success!");
                            // you can edit embed properties here. add/remove fields change colour etc...
                        } else {
                            embed = Utils.generateInfoEmbed(result, "Edit Whitelist: Failed!");
                        }
                        message.say(embed);

                    })
                    .catch(err => {

                        let embed = Utils.generateFailEmbed(`Error: ${err}`, "Failed!");
                        message.say(embed);

                    })
            })
            .catch(err => {

                //! Server with id `serverId` Not found
                let embed = Utils.generateFailEmbed(`Server not found or Invalid serverId specified: ${err}`, "Error")
                message.say(embed)

            })
    }
};