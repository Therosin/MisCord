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

const Client = require('disco-oauth');
require('dotenv').config()

const config = {
    ClientID: process.env.DISCORD_CLIENT_ID,
    ClientSecret: process.env.DISCORD_CLIENT_SECRET,
    ClientRedirect: (process.env.DISCORD_CLIENT_REDIRECT || `http://localhost:${process.env.NODEJS_HTTP_PORT}/discord/login`)
}


const client = new Client(config.ClientID, config.ClientSecret);

client.setScopes('identify', 'guilds');
client.setRedirect(`${config.ClientRedirect}`);

module.exports = client;
