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

const DataManager = require('../../../datamanager')
const datamanager = new DataManager()

export default async function handler(req, res) {
    const { method, query } = req

    if (query.guildId == undefined) {
        res.status(400).json({ success: false, reason: 'invalid guildId' })
    }

    let Database = await datamanager.GetDatabase()


    switch (method) {
        case 'GET':
            try {
                const servers = await Database.ServerController.getServers(query.guildId) //getServers(query.guildId)
                res.status(200).json({ success: true, data: servers })
            } catch (error) {
                console.error(error)
                res.status(400).json({ success: false, message: 'failed to fetch servers for guild' })
            }
            break
        // case 'POST':
        //   try {
        //     const user = await User.create(req.body)
        //     res.status(201).json({ success: true, data: user })
        //   } catch (error) {
        //     res.status(400).json({ success: false })
        //   }
        //   break
        default:
            res.status(400).json({ success: false })
            break
    }
}