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
const MiscreatedHTTPInterop = require('../../../Plugins/MiscreatedHTTPInterop')

// handle fetching data using MiscreatedInterop and serverData from database

export default async function handler(req, res) {
    const { method, query } = req

    if (query.guildId == undefined) {
        res.status(400).json({ success: false, reason: 'invalid guildId' })
    }

    if (query.serverId == undefined) {
        res.status(400).json({ success: false, reason: 'invalid serverId' })
    }

    let mapKind
    if (query.action == undefined) {
        mapKind = 'livemap:all'
    } else {
        mapKind = query.action
    }


    let Database = await datamanager.GetDatabase()

    switch (method) {
        case 'GET':
            try {

                // try to get server data from database
                const serverData = await Database.ServerController.getServer(query.guildId, { server_id: query.serverId })

                // if we found the server, use it to create a MiscreatedInterop object
                if (serverData && serverData.server_id) {
                    const HTTPInterop = new MiscreatedHTTPInterop(serverData.server_ip, serverData.server_rconport, serverData.server_authkey)
                    if (HTTPInterop) {
                        let mapData = []
                        // parse mapKind to get the correct map data eg mapKind `livemap:tents` will return `tents` and must contain `livemap:` in the map name
                        if (mapKind.includes('livemap:')) {
                            mapKind = mapKind.replace('livemap:', '')
                        }
                        if (mapKind == 'all') {
                            const base_locations = await HTTPInterop.getBaseLocations()
                            mapData.push({ kind: 'base_locations', data: base_locations })
                            const player_locations = await HTTPInterop.getPlayerLocations()
                            mapData.push({ kind: 'player_locations', data: player_locations })
                            const airdrop_locations = await HTTPInterop.getAirdropLocations()
                            mapData.push({ kind: 'airdrop_locations', data: airdrop_locations })
                            const planecrash_locations = await HTTPInterop.getPlaneCrashLocations()
                            mapData.push({ kind: 'planecrash_locations', data: planecrash_locations })
                            const tent_locations = await HTTPInterop.getTentLocations()
                            mapData.push({ kind: 'tent_locations', data: tent_locations })
                        } else if (mapKind == 'base_locations') {
                            const base_locations = await HTTPInterop.getBaseLocations()
                            mapData.push({ kind: 'base_locations', data: base_locations })
                        } else if (mapKind == 'player_locations') {
                            const player_locations = await HTTPInterop.getPlayerLocations()
                            mapData.push({ kind: 'player_locations', data: player_locations })
                        } else if (mapKind == 'airdrop_locations') {
                            const airdrop_locations = await HTTPInterop.getAirdropLocations()
                            mapData.push({ kind: 'airdrop_locations', data: airdrop_locations })
                        } else if (mapKind == 'planecrash_locations') {
                            const planecrash_locations = await HTTPInterop.getPlaneCrashLocations()
                            mapData.push({ kind: 'planecrash_locations', data: planecrash_locations })
                        } else if (mapKind == 'tent_locations') {
                            const tent_locations = await HTTPInterop.getTentLocations()
                            mapData.push({ kind: 'tent_locations', data: tent_locations })
                        } else {
                            // raise an error
                            res.status(400).json({ success: false, reason: 'invalid mapKind' })
                        }
                        res.status(200).json({ success: true, data: mapData })
                    } else {
                        // raise an error
                        res.status(400).json({ success: false, reason: 'invalid HTTPInterop' })
                        console.log('invalid HTTPInterop')
                        console.log(HTTPInterop)
                    }
                } else {
                    // raise an error
                    res.status(400).json({ success: false, reason: 'invalid serverData' })
                    console.log(`[MiscreatedInterop] Could not find server data for server ${query.serverId}`)
                    console.log(serverData)
                }

            } catch (error) {
                console.error(error)
                res.status(400).json({ success: false, message: 'failed to fetch server' })
            }
            break;
        default:
            res.status(400).json({ success: false })
            break
    }
}