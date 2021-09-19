// Copyright (C) 2021 Theros @[MisModding|SvalTek]
// 
// This file is part of MisCord.
// 
// MisCord is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// MisCord is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with MisCord.  If not, see <http://www.gnu.org/licenses/>.

const Command = require("../../Modules/Command");
const Utils = require("../../util/BotUtils")

const GetUser = async (UserManager, discordId) => {
    return await UserManager.getUser({ User_discordId: discordId })
}

module.exports = class PlayerConnectCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'player-connect',
            group: 'player',
            memberName: 'player-connect',
            description: 'show your connectId',
            examples: [
                `${client.commandPrefix} player-connect`,
            ],
            guildOnly: true,
            args: [],
            protectedCommand: false,
            //CommandAllowedRoles: ["Miscord-User", "miscord-user"],
        });
    }

    async run(message) {
        const UserManager = this.client.UserManager
        //Needed Vars
        const
            discordId = message.author.id;

        let embed
        GetUser(UserManager, discordId).then((User) => {
            embed = Utils.generateSuccessEmbed(`Your connectId is: ${User.User_connectId}`, "Display ConnectId: Ok!")
        }).catch((err) => {
            embed = Utils.generateFailEmbed(`\nFailed to Show ConnectId\n > Have you registered with ${this.client.commandPrefix} player-register {steamId} .?`, "Display ConnectId: Fail!", `Error: ${err}`)
        }).finally(() => {
            return message.say(embed)
        })
    }
};