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

    addUser(User) {
        return new Promise(async (resolve, reject) => {
            const doc = new UserModel({
                User_discordId: User.discordId,
                User_steamId: User.steamId,
                User_connectId: User.connectId
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

    getUser(User_data) {
        return new Promise(async (resolve, reject) => {
            const User = await UserModel.findOne({ ...User_data })
            if (!User) {
                reject("Unknown User")
            } else {
                resolve(User)
            }
        })
    }

    updateUser(userId, User_data) {
        return new Promise(async (resolve, reject) => {
            if (!userId) { reject("missing userId") }
            try {
                resolve(await UserModel.findOneAndUpdate({ _id: userId }, User_data, { new: true }));
            } catch (error) {
                reject(err)
            }
        })
    }

    delUser(id) {
        return new Promise(async (resolve, reject) => {
            if (!id) { reject("missing id") }
            const User = await UserModel.findOne({ _id: id })
            if (!User) {
                reject("that User does not exist")
            } else {
                resolve(await User.remove())
            }
        })
    }
}