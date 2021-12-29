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


const mongoose = require('mongoose')
const GuildModel = mongoose.models.Guilds || require('../Models/Guilds')

// This isnt used for Musch at the moment, but will serve as guild(discord server) data storage for future feature implementation.

module.exports = class GuildController {
    addGuild(guild_id) {
        return new Promise(async (resolve, reject) => {
            if (!guild_id) { reject("missing guild_id") }
            const doc = new GuildModel({ id: guild_id })
            resolve(await doc.save())
        })
    }

    getGuild(guild_id) {
        return new Promise(async (resolve, reject) => {
            if (!guild_id) { reject("missing guild_id") }
            const guild = await GuildModel.findOne({ id: guild_id })
            if (!guild) {
                reject("that guild does not exist")
            } else {
                resolve(guild)
            }
        })
    }
}