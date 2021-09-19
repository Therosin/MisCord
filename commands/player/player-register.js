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


const CreateUser = async (UserManager, discordId, steamId) => {
    return new Promise((resolve, reject) => {
        UserManager.addUser({ discordId: discordId, steamId: steamId }).then((UserId) => {
            if (UserId) {
                resolve(true, `UserManager: User Registered with Id: ${UserId}`)
            }
        }).catch((err) => {
            reject(err)
        });
    })
}

module.exports = class PlayerConnectCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'player-register',
            group: 'player',
            memberName: 'player-register',
            description: 'register your steamId for MisCord=Helper interaction/authorisation.\n you need to do this if you want to use some advanced MisCord features\n and/or to be able to recieve rewards,etc to your player ingame\n you must provide your steamId as the only param (you can find this by going to http://steamid.io you need your steam64Id)',
            examples: [
                `${client.commandPrefix} player-register 32049123192`,
            ],
            guildOnly: true,
            args: [
                {
                    key: 'steamId',
                    prompt: "please enter your steamId (you can find this by going to http://steamid.io you need your steam64Id)",
                    type: 'string',
                },
            ],
            protectedCommand: false,
            //CommandAllowedRoles: ["Miscord-User", "miscord-user"],
        });
    }

    async run(message, args) {
        const UserManager = this.client.UserManager
        //Needed Vars
        const
            discordId = message.author.id,
            steamId = args.steamId;

        let embed
        CreateUser(UserManager, discordId, steamId).then((created, msg) => {
            if (created) {
                embed = Utils.generateSuccessEmbed(`player registration compleated you can get you connectId to use on compatible server using ${this.client.commandPrefix} player-connect`, "Register Player: Ok!")
                console.log(msg)
            }
        }).catch((err) => {
            embed = Utils.generateFailEmbed(`\nFailed to Register Player\n > Check below for Error info....\n`, "Register Player: Fail!", `Error: ${err}`)
        }).finally(() => {
            return message.say(embed)
        })
    }
};