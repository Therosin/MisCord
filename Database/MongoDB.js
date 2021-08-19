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



/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const { connect, connection } = require('mongoose')

require('dotenv').config()
const MONGOCFG = {
    URI: process.env.MONGO_URI,
    DBNAME: process.env.MONGO_DBNAME,
    USER: process.env.MONGO_USER,
    PASSWORD: process.env.MONGO_PASSWORD
}

const GuildController = require('./Controllers/Guild.js')
const ServerController = require('./Controllers/Server.js')

const MongoDBProvider = require('commando-provider-mongo').MongoDBProvider;

module.exports = class MongoDatabase {
    constructor(client) {
        this.client = client;
        (async () => {
            this.client.logger.info(`Connectiong to: ${MONGOCFG.URI}/${MONGOCFG.DBNAME}`)
            await connect(`mongodb+srv://${MONGOCFG.USER}:${MONGOCFG.PASSWORD}@${MONGOCFG.URI}/${MONGOCFG.DBNAME}?retryWrites=true&w=majority`
                , {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                    useCreateIndex: true
                })
        })().then(() => {
            this.client.logger.info("[DATABASE] Connection to Database Succeded [MongoDB Connect]")
            this.client.logger.info("Set Client Provider as MongoDB")
            this.client.setProvider(
                new MongoDBProvider(connection.getClient(), 'MisCord')
            ).catch(client.logger.error);
            this.GuildController = new GuildController(client)
            this.ServerController = new ServerController(client)
        }).catch(err => {
            this.client.logger.error(`[DATABASE] Connection Failed [MongoDB Connect]\n Reason: ${err}`)
        })
    }
};