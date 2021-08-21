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


const { Command } = require('discord.js-commando');

const Utils = require("../../util/BotUtils")
const Interop = require("../../Plugins/MiscreatedInterop");

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
 function execShellCommand(cmd) {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
     exec(cmd, (error, stdout, stderr) => {
      if (error) {
       console.warn(error);
      }
      resolve(stdout? stdout : stderr);
     });
    });
   }


module.exports = class UtilUpdateAndRestartCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bot-update',
            group: 'util',
            memberName: 'bot-update',
            description: 'Developer Only: Update and Restart the Bot on the current Shard',
            args: [
                {
                    key: 'commitPath',
                    prompt: 'any params for update?',
                    type: 'string'
                },
            ],
            examples: [
                `${client.commandPrefix} bot-update`,
                `${client.commandPrefix} bot-update "origin pull/11/head"`
            ],
            guildOnly: false,
        });
    }

    hasPermission(msg) {
        if (this.client.isOwner(msg.author)) {
            return true
        };

        //---- Allow anyone with developer role in SvalTek to UpdateAndRestart

		const supportGuild = this.client.guilds.cache.get('588187481971621888')  // Holds a reference to the main SvalTek Discord
        // try to find this member in supportGuild
        const member = supportGuild.members.cache.get(msg.author.id)
        // check this member is in Developer role
        const isDeveloper = member ? member.roles.cache.some(role => role.id === '588199855772663818') : false
        if (isDeveloper) {
            return true
        }
    }

    async run(message, args) {
        message.delete();

        return new Promise(async (fulfill, reject) => {

            try {
                const cmdArg = args.commitPath || "";
                fulfill(execShellCommand(`git pull ${cmdArg}`))
            } catch (err) {
                reject(err)
            }
        })
            .then(result => {
                //! Success, Restart
                let embed = Utils.generateSuccessEmbed(`Update Compleate... Restarting!\n\n\`\`\`\n${result}\n\`\`\``, `Bot Update Ok!`)
                message.say(embed)
                return message.client.ProcRestart()
            })
            .catch(err => {
                //! Error
                let embed = Utils.generateFailEmbed(`Failed to Update, Will not Restart!\n\n\`\`\`\n${err}\n\`\`\``, "Bot Update Fail!")
                message.say(embed)
            })
    }
};