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

const Command = require("../../Modules/Command");
const Utils = require("../../util/BotUtils")
const Interop = require('../../Plugins/MiscreatedHTTPInterop')
const Discord = require('discord.js');
const MapManager = require('../../Plugins/MapManager');
const { generateEmbed } = require("../../util/BotUtils");

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}


//
// ────────────────────────────────────────────────────────── PAGE GENERATORS ─────
//


const genPlayerPages = function (entries) {
    let result = []
    if (entries && Array.isArray(entries)) {
        entries.forEach(player => {
            let playerInfo = `
            > **Name**: \`${player.Name}\`
            > **SteamId**: \`${player.SteamId}\`
            > **Location**: [ X = \`${player.Location['x']}\`, Y = \`${player.Location['y']}\`, Z = \`${player.Location['z']}\` ]
            > **Health**: \`${player.Health}\`
            \n`
            result.push(playerInfo)
        })
    }
    return result
}


const genBasePages = function (entries) {
    let result = []
    if (entries && Array.isArray(entries)) {
        entries.forEach(base => {
            let baseInfo = `
            > **Location**: [ X = \`${base.Location['x']}\`, Y = \`${base.Location['y']}\`, Z = \`${base.Location['z']}\` ]
            > **Part Count**: [\`${base.PartCount}\`]
            > **Owner**
            >   **Name**: \`${base.Owner.Name}\` **SteamId**: \`${base.Owner.SteamId}\` **Online**: \`${base.Owner.Online}\`
            \n`
            result.push(baseInfo)
        })
    }
    return result
}


const genAirdropPages = function (entries) {
    let result = []
    if (entries && Array.isArray(entries)) {
        entries.forEach(airdrop => {
            let airdropInfo = `
            > **Name**: \`${airdrop.Name}\`
            > **Location**: [ X = \`${airdrop.Location['x']}\`, Y = \`${airdrop.Location['y']}\`, Z = \`${airdrop.Location['z']}\` ]
            \n`
            result.push(airdropInfo)
        })
    }
    return result
}

const genPlanecrashPages = function (entries) {
    let result = []
    if (entries && Array.isArray(entries)) {
        entries.forEach(planecrash => {
            let planecrashInfo = `
            > **Name**: \`${planecrash.Name}\`
            > **Location**: [ X = \`${planecrash.Location['x']}\`, Y = \`${planecrash.Location['y']}\`, Z = \`${planecrash.Location['z']}\` ]
            \n`
            result.push(planecrashInfo)
        })
    }
    return result
}

const genTentPages = function (entries) {
    let result = []
    if (entries && Array.isArray(entries)) {
        entries.forEach(tent => {
            let tentInfo = `
            > **Name**: \`${tent.Name}\`
            > **Location**: [ X = \`${tent.Location['x']}\`, Y = \`${tent.Location['y']}\`, Z = \`${tent.Location['z']}\` ]
            \n`
            result.push(tentInfo)
        })
    }
    return result
}

// ────────────────────────────────────────────────────────────────────────────────

module.exports = class PlayerLocationsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'locations',
            group: 'locations',
            memberName: 'locations',
            description: 'show locations.',
            examples: [
                `${client.commandPrefix} locations MyCoolServer airdrops`,
                `${client.commandPrefix} locations cef34 players false`,
            ],
            guildOnly: true,
            args: [
                {
                    key: 'serverIdOrName',
                    prompt: 'enter the serverName or serverId to show the player locations for',
                    type: 'string'
                },
                {
                    key: 'locationsKind',
                    prompt: 'enter the kind of locations to find, only one [player|base|airdrop|planecrash|tents|vehicals]',
                    type: 'string'
                },
                {
                    key: 'useMap',
                    prompt: 'would you like to generate a map',
                    type: 'boolean',
                    default: true
                }
            ],
            protectedCommand: true,
            CommandAllowedRoles: ["Miscord-User", "miscord-user"],
        });
    }

    async run(message, args) {

        const guildId = message.guild.id
        const serverIdOrName = args.serverIdOrName
        const locationsKind = args.locationsKind
        const useMap = args.useMap
        if (!serverIdOrName) { return message.say("You must specify a serverId to get info for.") }

        return this.getServerforGuild(guildId, serverIdOrName)
            .then(async (server_data) => {
                if (server_data && server_data.server_id) {
                    const ServerApi = new Interop(server_data.server_ip, server_data.server_rconport, server_data.server_authkey)
                    if (ServerApi && locationsKind) {
                        let action
                        switch (locationsKind) {
                            case "player":
                                /**
                                 * TODO: select correct map from serverInfo
                                */
                                const playerMarker = "./assets/PlayerIcon.png"
                                let current_map = "canyonlands"
                                let map_file = `./assets/${current_map}_4k.png`
                                action = ServerApi.getPlayerLocations()
                                    .then(async (response) => {
                                        if (response) {
                                            if (isEmpty(response)) {
                                                return message.say(Utils.generateFailEmbed("Server returned No Online Players", "Player Locations"))
                                            }

                                            if (useMap) {
                                                const Map = new MapManager(2048, 2048)
                                                let map_loaded = false
                                                await Map.setBackgroundImage(map_file)
                                                    .then(() => {
                                                        map_loaded = true
                                                    })
                                                    .catch(err => {
                                                        return message.say(Utils.generateFailEmbed(`Failed to Load Map: ${current_map} > ${err}`, "Player Locations"))
                                                    })
                                                if (map_loaded) {

                                                    let players = response
                                                    for (const player of players) {
                                                        const marker = {
                                                            "name": player.Name,
                                                            "steamId": player.SteamId,
                                                            "health": player.Health,
                                                            "location": {
                                                                "x": player.Location['x'],
                                                                "y": player.Location['y'],
                                                            },
                                                            "elevation": player.Location['z']
                                                        }
                                                        let bounds = { "x": 0, "y": 0 }
                                                        if (current_map == "canyonlands") {
                                                            bounds.x = 5680
                                                            bounds.y = 4900
                                                        }
                                                        if (current_map == "islands") {
                                                            bounds.x = 8096
                                                            bounds.y = 8096
                                                        }
                                                        marker.location = Map.scalePoint(marker.location, bounds)
                                                        console.log(`player ${marker.name} at X: ${marker.location.x}  Y:${marker.location.y}`)
                                                        const markerLocation = marker.location
                                                        await Map.addImageToCanvas(playerMarker, markerLocation.x, markerLocation.y, 30, 49)
                                                            .catch(err => {
                                                                return message.say(Utils.generateFailEmbed(`Failed to Add Marker > ${err}`, "Player Locations"))
                                                            })
                                                        const playerInfo = `
                                                        name: ${marker.name} steamId: ${marker.steamId}
                                                        Location: x:${marker.location.x} y:${marker.location.y} elevation: ${marker.elevation}
                                                        `
                                                        Map.addTextToCanvas(playerInfo, markerLocation.x, markerLocation.y - 3, '23px sans-serif', '#fc032c', 250)
                                                    }

                                                    const MapImage = new Discord.MessageAttachment(Map.getImageBuffer(), `${server_data.server_id}-PlayerMap.png`)
                                                    let PlayerMapEmbed = generateEmbed(`Map For: \`${current_map}\``, "Player Map")
                                                    PlayerMapEmbed.attachFiles(MapImage)
                                                    message.say(PlayerMapEmbed)
                                                }

                                            } else {
                                                const player_entries = genPlayerPages(response)
                                                const player_pages = Utils.slicedArray(Array.from(player_entries), 5)
                                                let pages = [];
                                                player_pages.forEach(page => { pages.push(page.join(`\n`)) })
                                                return Utils.sendPagedEmbed(message, pages)
                                            }
                                        }
                                    })

                                break;
                            case "base":
                                action = ServerApi.getBaseLocations()
                                    .then((response) => {
                                        if (response) {
                                            if (isEmpty(response)) {
                                                return message.say(Utils.generateFailEmbed("Server returned No Bases", "Bases Locations"))
                                            }

                                            if (useMap) {
                                                let bases = response

                                            } else {
                                                const base_entries = genBasePages(response)
                                                const base_pages = Utils.slicedArray(Array.from(base_entries), 5)
                                                let pages = [];
                                                base_pages.forEach(page => { pages.push(page.join(`\n`)) })
                                                return Utils.sendPagedEmbed(message, pages)
                                            }
                                        }
                                    })

                                break;
                            case "airdrop":
                                action = ServerApi.getAirdropLocations()
                                    .then((response) => {
                                        if (response) {
                                            if (isEmpty(response)) {
                                                return message.say(Utils.generateFailEmbed("Server returned No Airdrops", "Airdrop Locations"))
                                            }

                                            if (useMap) {
                                                let airdrops = response

                                            } else {
                                                const airdrop_entries = genAirdropPages(response)
                                                const airdrop_pages = Utils.slicedArray(Array.from(airdrop_entries), 5)
                                                let pages = [];
                                                airdrop_pages.forEach(page => { pages.push(page.join(`\n`)) })
                                                return Utils.sendPagedEmbed(message, pages)
                                            }
                                        }
                                    })

                                break;
                            case "planecrash":
                                action = ServerApi.getPlaneCrashLocations()
                                    .then((response) => {
                                        if (response) {
                                            if (isEmpty(response)) {
                                                return message.say(Utils.generateFailEmbed("Server returned No Planecrashes", "Planecrash Locations"))
                                            }

                                            if (useMap) {
                                                let planecrashes = response

                                            } else {
                                                const planecrash_entries = genPlanecrashPages(response)
                                                const planecrash_pages = Utils.slicedArray(Array.from(planecrash_entries), 5)
                                                let pages = [];
                                                planecrash_pages.forEach(page => { pages.push(page.join(`\n`)) })
                                                return Utils.sendPagedEmbed(message, pages)
                                            }
                                        }
                                    })

                                break;
                            case "vehical":
                                const embed = Utils.generateFailEmbed("Not Implemented", "Vehical Locations", "under development")
                                return message.say(embed)

                                break;
                            case "tent":
                                action = ServerApi.getTentLocations()
                                    .then((response) => {
                                        if (response) {
                                            if (isEmpty(response)) {
                                                return message.say(Utils.generateFailEmbed("Server returned No Tents", "Tent Locations"))
                                            }

                                            if (useMap) {
                                                let tents = response

                                            } else {
                                                const tent_entries = genTentPages(response)
                                                const tent_pages = Utils.slicedArray(Array.from(tent_entries), 5)
                                                let pages = [];
                                                tent_pages.forEach(page => { pages.push(page.join(`\n`)) })
                                                return Utils.sendPagedEmbed(message, pages)
                                            }
                                        }
                                    })

                                break;
                            default:
                                let embed_2 = Utils.generateFailEmbed(`unknown location Kind: ${locationsKind}`, "Location Info")
                                return message.say(embed_3)
                                break;
                        }
                        return await action.catch((error) => {
                            let embed_3 = Utils.generateFailEmbed(`${error}`, "HTTP method fail")
                            message.say(embed_3)
                        })
                    }
                }

            })
            .catch(err => {
                //! Server with id `serverId` Not found
                let embed = Utils.generateFailEmbed(`Server not found or Invalid serverId specified: ${err}`, "Failed!")
                message.say(embed)
            })
    }
};