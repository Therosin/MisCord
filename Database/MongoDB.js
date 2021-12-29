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

const { connect } = require('mongoose')
const GuildController = require('./Controllers/Guild')
const ServerController = require('./Controllers/Server')
const UserController = require('./Controllers/User')

require('dotenv').config('.env.local')
const MONGOCFG = {
    URI: process.env.MONGO_URI,
    DBNAME: process.env.MONGO_DBNAME,
    USER: process.env.MONGO_USER,
    PASSWORD: process.env.MONGO_PASSWORD
}

module.exports = class MongoDatabase {
    constructor() {
        return (async () => {
            console.info(`Initialising MongoDB Connection to: ${MONGOCFG.URI}/${MONGOCFG.DBNAME}`)
            await connect(`mongodb+srv://${MONGOCFG.USER}:${MONGOCFG.PASSWORD}@${MONGOCFG.URI}/${MONGOCFG.DBNAME}?retryWrites=true&w=majority`
                , {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                    useCreateIndex: true
                })
        })().then(() => {
            console.info("[DATABASE] Connection to Database Succeded [MongoDB Connect]")
            
            this.GuildController = new GuildController()
            this.ServerController = new ServerController()
            this.UserController = new UserController()
            return this
        }).catch(err => {
            console.error(`[DATABASE] Connection Failed [MongoDB Connect]\n Reason: ${err}`)
        })
    }
};