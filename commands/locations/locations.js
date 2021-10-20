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
const Interop = require("../../Plugins/MiscreatedInterop")
const HTTPInterop = require('../../Plugins/MiscreatedHTTPInterop')
const Discord = require('discord.js');
const MapManager = require('../../Plugins/MapManager');
const { generateEmbed } = require("../../util/BotUtils");

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}


let current_map = "unset"
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


//
// ────────────────────────────────────────────────────────── MAP GENERATORS ──────
//

const GetMapBounds = function (current_map) {
    let bounds = { "x": 0, "y": 0 }
    if (current_map == "canyonlands") {
        bounds.x = 4096
        bounds.y = 4096
    }
    if (current_map == "islands") {
        bounds.x = 8192
        bounds.y = 8192
    }
    return bounds
}

const Map_AddPlayerMarkers = async function (Map, players) {
    const playerMarker = "./assets/PlayerIcon.png"
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
        let bounds = GetMapBounds(current_map)
        if (current_map == "canyonlands") {
            bounds.x = 4096
            bounds.y = 4096
        }
        if (current_map == "islands") {
            bounds.x = 8192
            bounds.y = 8192
        }
        marker.location = Map.scalePoint(marker.location, bounds)
        const markerLocation = marker.location
        await Map.addImageToCanvas(playerMarker, markerLocation.x, markerLocation.y, 25, 25)
            .catch(err => {
                console.error(`Failed to Add Marker > ${err}`, "Player Locations")
            })
        const playerInfo = `name: ${marker.name} steamId: ${marker.steamId}\nLocation: x:${marker.location.x} y:${marker.location.y} elevation: ${marker.elevation}`
        Map.addTextToCanvas(playerInfo, markerLocation.x + 21, markerLocation.y, '23px sans-serif', '#fc032c', 300)
    }
}

const Map_AddBaseMarkers = async function (Map, bases) {
    const baseMarker = "./assets/baseIcon.png"
    for (const base of bases) {
        const marker = {
            "PartCount": base.PartCount,
            "OwnerId": base.Owner.SteamId,
            "OwnerOnline": base.Owner.Online,
            "location": {
                "x": base.Location['x'],
                "y": base.Location['y'],
            },
            "elevation": base.Location['z']
        }
        let bounds = GetMapBounds(current_map)
        marker.location = Map.scalePoint(marker.location, bounds)
        const markerLocation = marker.location
        await Map.addImageToCanvas(baseMarker, markerLocation.x, markerLocation.y, 25, 25)
            .catch(err => {
                console.error(`Failed to Add Marker > ${err}`, "Base Locations")
            })
        const baseInfo = `PartCount: ${marker.PartCount}\nLocation: x:${marker.location.x} y:${marker.location.y} | elevation: ${marker.elevation}\nOwner SteamId: ${marker.OwnerId} | Online: ${marker.OwnerOnline}`
        Map.addTextToCanvas(baseInfo, markerLocation.x + 21, markerLocation.y, '23px sans-serif', '#fc032c', 300)
    }
}


const GenLocationsMap = function (kind, locationData) {
    let map_file = `./assets/${current_map}_4k.png`
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
        switch (kind) {
            case 'players':
                Map_AddPlayerMarkers(Map, locationData)
                break;

            case 'bases':
                Map_AddBaseMarkers(Map, locationData)
                break;

            case 'airdrops':
                //Map_AddAirdropMarkers(Map, locationData)
                break;

            case 'planecrashs':
                //Map_AddPlanecrashMarkers(Map, locationData)
                break;

            case 'tents':
                //Map_AddTentMarkers(Map, locationData)
                break;

            default:
                break;
        }

        return Map
    }
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
                    prompt: 'enter the kind of locations to find, only one [players|bases|airdrops|planecrashs|tents|vehicals]',
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

        this.getServerforGuild(guildId, serverIdOrName)
            .then(async (server_data) => {
                if (server_data && server_data.server_id) {
                    try {
                        const server = new Interop(server_data.server_ip, server_data.server_rconport, server_data.server_password);
                        // ensure we have a valid server object.
                        if (!server.server) { reject(`failed to create misrcon interface for server: ${serverIdOrName}`); }

                        const serverStatus = await server.getStatus();
                        current_map = serverStatus.level
                    } catch (err) {
                        //! failed to fetch server status
                        let embed = Utils.generateFailEmbed(`failed to fetch server Info: ${err}`, "Failed!")
                        return message.say(embed)
                    } finally {
                        const ServerApi = new HTTPInterop(server_data.server_ip, server_data.server_rconport, server_data.server_authkey)
                        if (ServerApi && locationsKind) {
                            let action
                            switch (locationsKind) {
                                case "players":
                                    /**
                                        * TODO: select correct map from serverInfo
                                    */
                                    action = ServerApi.getPlayerLocations()
                                        .then(async (response) => {
                                            if (response) {
                                                if (isEmpty(response)) {
                                                    return message.say(Utils.generateFailEmbed("Server returned No Online Players", "Player Locations"))
                                                }

                                                if (useMap) {
                                                    let Map = GenLocationsMap("players", current_map, response)
                                                    const MapImage = new Discord.MessageAttachment(Map.getImageBuffer(), `${server_data.server_id}-PlayerMap.png`)
                                                    let PlayerMapEmbed = generateEmbed(`Map For: \`${current_map}\``, "Player Map")
                                                    PlayerMapEmbed.attachFiles(MapImage)
                                                    message.say(PlayerMapEmbed)

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
                                case "bases":
                                    action = ServerApi.getBaseLocations()
                                        .then((response) => {
                                            if (response) {
                                                if (isEmpty(response)) {
                                                    return message.say(Utils.generateFailEmbed("Server returned No Bases", "Bases Locations"))
                                                }
                                                if (useMap) {
                                                    let Map = GenLocationsMap("bases", current_map, response)
                                                    const BasesMapImage = new Discord.MessageAttachment(Map.getImageBuffer(), `${server_data.server_id}-BasesMap.png`)
                                                    let BasesMapEmbed = generateEmbed(`Map For: \`${current_map}\``, "Bases Map")
                                                    BasesMapEmbed.attachFiles(BasesMapImage)
                                                    message.say(BasesMapEmbed)
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
                                case "airdrops":
                                    action = ServerApi.getAirdropLocations()
                                        .then((response) => {
                                            if (response) {
                                                if (isEmpty(response)) {
                                                    return message.say(Utils.generateFailEmbed("Server returned No Airdrops", "Airdrop Locations"))
                                                }

                                                if (useMap) {
                                                    let Map = GenLocationsMap("airdrops", current_map, response)
                                                    const AirdropMapImage = new Discord.MessageAttachment(Map.getImageBuffer(), `${server_data.server_id}-AirdropMap.png`)
                                                    let AirdropMapEmbed = generateEmbed(`Map For: \`${current_map}\``, "Airdrop Map")
                                                    AirdropMapEmbed.attachFiles(AirdropMapImage)
                                                    message.say(AirdropMapEmbed)

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
                                case "planecrashs":
                                    action = ServerApi.getPlaneCrashLocations()
                                        .then((response) => {
                                            if (response) {
                                                if (isEmpty(response)) {
                                                    return message.say(Utils.generateFailEmbed("Server returned No Planecrashes", "Planecrash Locations"))
                                                }

                                                if (useMap) {
                                                    let Map = GenLocationsMap("planecrashs", current_map, response)
                                                    const PlanecrashMapImage = new Discord.MessageAttachment(Map.getImageBuffer(), `${server_data.server_id}-PlanecrashMap.png`)
                                                    let PlanecrashMapEmbed = generateEmbed(`Map For: \`${current_map}\``, "Planecrash Map")
                                                    PlanecrashMapEmbed.attachFiles(PlanecrashMapImage)
                                                    message.say(PlanecrashMapEmbed)

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
                                case "vehicals":
                                    const embed = Utils.generateFailEmbed("Not Implemented", "Vehical Locations", "under development")
                                    return message.say(embed)

                                    break;
                                case "tents":
                                    action = ServerApi.getTentLocations()
                                        .then((response) => {
                                            if (response) {
                                                if (isEmpty(response)) {
                                                    return message.say(Utils.generateFailEmbed("Server returned No Tents", "Tent Locations"))
                                                }

                                                if (useMap) {
                                                    let Map = GenLocationsMap("tents", current_map, response)
                                                    const TentMapImage = new Discord.MessageAttachment(Map.getImageBuffer(), `${server_data.server_id}-TentMap.png`)
                                                    let TentMapEmbed = generateEmbed(`Map For: \`${current_map}\``, "Tent Map")
                                                    TentMapEmbed.attachFiles(TentMapImage)
                                                    message.say(TentMapEmbed)

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
                                    return message.say(embed_2)
                                    break;
                            }
                            return await action.catch((error) => {
                                let embed_3 = Utils.generateFailEmbed(`${error}`, "HTTP method fail")
                                message.say(embed_3)
                            })
                        }
                    }
                }

            })
            .catch(err => {
                //! Server with id `serverId` Not found
                let embed = Utils.generateFailEmbed(`Server not found or Invalid serverId specified: ${err}`, "Failed!")
                return message.say(embed)
            })
    }
};