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

const UserModel = require('../Models/Users')
require('dotenv').config()

module.exports = class UserController {
    constructor(client) {
        this.client = client;
    }

    addUser(guild, User) {
        return new Promise(async (resolve, reject) => {
            if (!guild) { reject("missing guild") }
            const doc = new UserModel({
                guild: guild,
                User_id: User.id,
                User_discordId: User.discordId,
                User_steamId: User.steamId,
            })

            await doc.save()
                .then(saved => {
                    const new_User = saved.toObject()
                    if (new_User && new_User.User_id === User.id) {
                        resolve(saved.User_id)
                    } else {
                        reject("Error Saving Data, [UserId not match]")
                    }
                })
                .catch(err => {
                    reject(`Error in SaveData: ${err}`)
                })
        })
    }

    getUsers(guild) {
        return new Promise(async (resolve, reject) => {
            if (!guild) { reject("missing guild") }
            const Users = await UserModel.find({ guild: guild })
            if (!Users) {
                reject(`no managed users for guild: ${guild}`)
            } else {
                resolve(Users)
            }
        })
    }
    getUser(guild, User_data) {
        return new Promise(async (resolve, reject) => {
            if (!guild) { reject("missing guild") }
            const User = await UserModel.findOne({ guild: guild, ...User_data })
            if (!User) {
                reject("Unknown User")
            } else {
                resolve(User)
            }
        })
    }

    updateUser(guild, userId, User_data) {
        return new Promise(async (resolve, reject) => {
            if (!guild) { reject("missing guild") }
            try {
                resolve(await UserModel.findOneAndUpdate({ User_id: userId }, User_data, { new: true }));
            } catch (error) {
                reject(err)
            }
        })
    }

    delUser(guild, User_id) {
        return new Promise(async (resolve, reject) => {
            if (!guild) { reject("missing guild") }
            if (!User_id) { reject("missing User_id") }
            const User = await UserModel.findOne({ User_id: User_id })
            if (!User) {
                reject("that User does not exist")
            } else {
                resolve(await User.remove())
            }
        })
    }
}