// Copyright (C) 2021 Theros [SvalTek|MisModding]
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

const MongoDatabase = require('./Database/MongoDB');
const UserManager = require('./Plugins/UserManager')
const MiscreatedServers = require('./Plugins/MiscreatedServers')
const SteamWebApi = require('./Plugins/SteamWebApi')

if (global.DataManager == undefined) {
    global.DataManager = {}
}

module.exports = class DataManager {
    GetDatabase() {
        return new Promise(async (resolve, reject) => {
            try {
                if (global.DataManager.Database == undefined) {
                    global.DataManager.Database = await new MongoDatabase()
                }
            } catch (error) {
                return reject(error)
            }
            resolve(global.DataManager.Database)
        });
    }

    GetUserManager() {
        return new Promise(async (resolve, reject) => {
            try {
                if (global.DataManager.UserManager == undefined) {
                    const db = await this.GetDatabase()
                    global.DataManager.UserManager = new UserManager(db)
                }
            } catch (error) {
                return reject(error)
            }
            resolve(global.DataManager.UserManager)
        });
    }

    GetMiscreatedServers() {
        return new Promise(async (resolve, reject) => {
            try {
                if (global.DataManager.MiscreatedServers == undefined) {
                    const db = await this.GetDatabase()
                    global.DataManager.MiscreatedServers = new MiscreatedServers(db)
                }
            } catch (error) {
                return reject(error)
            }
            return resolve(global.DataManager.MiscreatedServers)
        });
    }

    GetSteamWebApi() {
        return new Promise(async (resolve, reject) => {
            try {
                if (global.DataManager.SteamWebApi == undefined) {
                    const db = await this.GetDatabase()
                    global.DataManager.SteamWebApi = new SteamWebApi()
                }
            } catch (error) {
                reject(error)
            }
            return resolve(global.DataManager.SteamWebApi)
        });
    }

}