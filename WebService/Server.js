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

require('dotenv').config({ path: '../.env.local' })
const express = require('express')
const next = require('next')

module.exports = class Server {
    constructor(customPort) {
        this.port = customPort || 3000
        const dev = process.env.NODE_ENV !== 'production'
        this.app = next({
            dev: dev,
            dir: __dirname,
            conf: {
                serverRuntimeConfig: {
                    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
                    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
                    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
                    MONGO_URI: process.env.MONGO_URI,
                    MONGO_DBNAME: process.env.MONGO_DBNAME,
                    MONGO_USER: process.env.MONGO_USER,
                    MONGO_PASSWORD: process.env.MONGO_PASSWORD
                }
            }
        })
        this.handle = this.app.getRequestHandler()
    }

    async Start() {
        this.app.prepare().then(() => {
            const server = express()

            server.all('*', (req, res) => {
                return this.handle(req, res)
            })

            server.listen(this.port, (err) => {
                if (err) throw err
                console.log(`WebService> Ready on Port: ${this.port}`)
            })
        })
    }
}