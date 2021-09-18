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


module.exports = class UserManager {
    constructor(client) {
        this.client = client;
    }

    /**
     * find a specific User by guildId and User Object
     * @param {string} guild guildId of guild to fetch a User for
     * @param {object} User and object defining properties to filter by
     */
    getUser(guild, User) {
        return new Promise(async (fulfill, reject) => {
            try {

                // find User based on guild + provided User data
                let user = await this.client.db.UserController.getUser(guild, User)
                if (user) {
                    fulfill(user)
                } else {
                    let userId = await this.client.db.UserController.addUser(guild, User)
                    if (userId) {
                        fulfill(await this.client.db.UserController.getUser(guild, User))
                    }
                }

            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * fetch all Users belonging to a guild
     * @param {string} guild guildId to fetch Users for
     */
    getUsers(guild) {
        return new Promise(async (fulfill, reject) => {
            try {

                // find all Users based on guild
                fulfill(
                    await this.client.db.UserController.getUsers(guild)
                )
            } catch (err) {
                reject(err);
            }
        });

    }

    /**
     * Create a new User
     * @param {string} guild 
     * @param {object} User {discordId,steamId}
     */
    addUser(guild, User) {
        let User_data = {
            User_discordId: User.discordId,
            User_steamId: User.steamId
        }
        return new Promise(async (fulfill, reject) => {
            this.getUser(guild, User_data)
                .then(async found => {
                    if (found) {
                        reject("User exists")
                    } else {
                        try {
                            User.User_connectId = randomBytes(7).toString('hex')
                            fulfill(await this.client.db.UserController.addUser(guild, User))
                        } catch (err) {
                            console.error(`failed to create User: ${err}`)
                            reject(err);
                        }
                    }
                });
        })
    }

    /**
     * delete a User by guildId and UserId
     * @param {string} guild guildId of guild that owns the User
     * @param {string} UserId UserId of the User to delete
     */
    delUser(guild, UserId) {
        let User = {
            User_id: UserId
        }
        return new Promise(async (fulfill, reject) => {
            this.getUser(guild, User)
                .then(async found => {
                    if (found == undefined || found.User_id !== UserId) {
                        reject("User not found")
                    }
                    try {
                        fulfill(await this.client.db.UserController.delUser(guild, UserId))
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
    updateUser(guild, UserId, UserData) {
        let User = {
            User_id: UserId
        }
        return new Promise(async (fulfill, reject) => {
            this.getUser(guild, User)
                .then(async found => {
                    if (found == undefined || found.User_id !== UserId) {
                        reject("User not found")
                    }
                    try {
                        fulfill(await this.client.db.UserController.updateUser(guild, UserId, UserData))
                    } catch (err) {
                        reject(err);
                    }
                });
        })
    }
}