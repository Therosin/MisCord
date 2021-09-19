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

const Utils = require("../util/BotUtils")

module.exports = class UserManager {
    constructor(client) {
        this.client = client;
    }

    /**
     * find a specific User by matched User data
     * @param {object} User object defining properties to filter by
     */
    getUser(User) {
        return new Promise(async (fulfill, reject) => {
            try {

                // find User based on guild + provided User data
                let user = await this.client.db.UserController.getUser(User)
                if (user) {
                    fulfill(user)
                } else {
                    reject(`Unknown User`)
                }

            } catch (err) {
                reject(err);
            }
        })

    }

    /**
     * Create a new User
     * @param {string} guild 
     * @param {object} User {discordId,steamId}
     */
    addUser(User) {
        let User_data = {
            discordId: User.discordId,
            steamId: User.steamId,
            connectId: null
        }
        return new Promise(async (fulfill, reject) => {
            let UserId
            try {
                User_data.connectId = Utils.randomString(7)
                UserId = this.client.db.UserController.addUser(User_data)
                if (UserId) {
                    fulfill(true, UserId)
                }
            } catch (err) {
                console.error(`failed to create User: ${err}`)
                reject(err);
            }
        })
    }


    /**
     * delete a User by guildId and UserId
     * @param {string} UserId UserId of the User to delete
     */
    delUser(UserId) {
        const User = {
            id: UserId
        }
        return new Promise(async (fulfill, reject) => {
            this.getUser(User)
                .then(async found => {
                    if (found == undefined || found._id !== UserId) {
                        reject("User not found")
                    }
                    try {
                        fulfill(await this.client.db.UserController.delUser(UserId))
                    } catch (err) {
                        reject(err);
                    }
                });
        })
    }

    /**
     * Update a User by guildId and UserId
     * @param {string} guild guildId of guild that owns the User
     * @param {string} UserId UserId of the User to update
     * @param {object} UserData user Properties to update
     */
    updateUser(UserId, UserData) {
        return new Promise(async (fulfill, reject) => {
            this.getUser(UserData)
                .then(async found => {
                    if (found == undefined || found.User_id !== UserId) {
                        reject("User not found")
                    }
                    try {
                        fulfill(await this.client.db.UserController.updateUser(UserId, UserData))
                    } catch (err) {
                        reject(err);
                    }
                });
        })
    }
}