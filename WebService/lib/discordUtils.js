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
import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()
const DISCORD_TOKEN = serverRuntimeConfig.DISCORD_TOKEN

const Bottleneck = require("bottleneck");

// Never more than 2 requests running at a time.
// Wait at least 500ms between each request.
const limiter = new Bottleneck({
    maxConcurrent: 2,
    minTime: 500
});

import { CLIENT_URL, BASE_URL, OAUTH_USER_GUILD, GUILD_ROLES } from './discordEndpoints'

/** INTERNAL:: Generic Fetch wrapper to handle OAUTH/BOT Discord Api Requests
 * @param {boolean} asUser should we act as a bot using BOT TOKEN or as a user using OAUTH TOKEN
 * @param {string} ENDPOINT endpoint to fetch data from
 * @param {string} TOKEN    either a bot TOKEN or oauth accessToken
*/
function fetchDiscordApiData(asUser, ENDPOINT, TOKEN) {
    let current_headers = {}
    if (asUser) {
        current_headers["Authorization"] = `Bearer ${TOKEN}`
    } else {
        current_headers["User-Agent"] = "DiscordBot (https://github.com/Therosin/MisCord, 1)"
        current_headers["Authorization"] = `Bot ${TOKEN}`
    }
    console.log(`DiscordApi-> ${ENDPOINT}`)
    console.log(current_headers)
    return new Promise(async (resolve, reject) => {
        try {
            // try to fetch data
            const res = await fetch(
                `${BASE_URL}${ENDPOINT}`, {
                method: "GET",
                headers: current_headers,
            })
            //parse data
            resolve(await res.json())
        } catch (error) {
            reject(error)
        }
    });
}




//
// ────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: D I S C O R D   B O T   U T I L S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────
//

/**
 * BOT: Fetch All Available info for Specified Guild
 * @param {*} guildId current guildId
 * @returns {Promise<object>} guildInfo
 */
export function fetchGuildInfo(guildId) {
    return new Promise(async (resolve, reject) => {
        let data;
        try {
            data = await fetchDiscordApiData(false, GUILD(guildId), DISCORD_TOKEN)
        } catch (error) {
            reject(error)
        }
        resolve(data)
    });
}

/**
 * BOT: Fetch All Roles for Specified Guild
 * @param {*} guildId current guildId
 * @returns {Promise<object>} guildRoles
 */
export function fetchGuildRoles(guildId) {
    return new Promise(async (resolve, reject) => {
        let data;
        try {
            data = await fetchDiscordApiData(false, GUILD_ROLES(guildId), DISCORD_TOKEN)
        } catch (error) {
            reject(error)
        }
        resolve(data)
    });
}

/**
 * BOT: Fetch All available RoleInfo for specified Role and Guild
 * @param {*} guildId current guildId
 * @param {string} roleId ID of Role to Fetch
 * @returns {Promise<object>} guildRoleInfo
 */
export function fetchGuildRole(guildId, roleId) {
    return new Promise(async (resolve, reject) => {
        let data;
        try {
            data = await fetchDiscordApiData(false, GUILD_ROLE(guildId, roleId), DISCORD_TOKEN)
        } catch (error) {
            reject(error)
        }
        resolve(data)
    });
}



//
// ────────────────────────────────────────────────────────────────────────────── II ──────────
//   :::::: D I S C O R D   O A U T H   U T I L S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────
//

/**
 * OAUTH: Fetch All Available UserInfo for Specified Guild
 * @param {*} guildId current guildId
 * @param {string} accessToken  Valid oauth Token
 * @returns {Promise<object>} guildUserInfo
 */
export function fetchUserGuildInfo(guildId, accessToken) {
    return new Promise(async (resolve, reject) => {
        let data;
        try {
            data = await fetchDiscordApiData(true, OAUTH_USER_GUILD(guildId), accessToken)
        } catch (error) {
            reject(error)
        }
        resolve(data)
    });
}


export function mapUserRoles(userRoles, guildId) {
    return new Promise(async (resolve, reject) => {
        let result = [];
        if (userRoles && Array.isArray(userRoles)) {
            try {
                // try to fetch specified guilds roles
                const roles = await fetchGuildRoles(guildId)
                    .catch((err) => {
                        console.log(error)
                        return reject(error)
                    })

                // ensure roles is a valid array
                if (roles && Array.isArray(roles)) {

                    // map guilds roles to users specified roleIds
                    for (const userRoleId in userRoles) {
                        const foundRole = roles.find((r) => { r.id == userRoleId })
                        if (foundRole) {
                            result.push(foundRole)
                        }
                    }
                    resolve(result)
                    // roles not an array?
                } else {
                    reject('failed fetching GuildRoles:: not an array')
                }

            } catch (error) {

            }

        } else {
            // got invalid userRoles type
            reject("userRoles must be an array")
        }
    });
}

export function fetchDiscordUserData(session, currentGuild) {

    let UserGuildInfo;
    let UserRoleInfo;

    return new Promise(async (resolve, reject) => {
        // check we have a valid session
        if (session && (session.user != null || undefined)) {
            const { user } = session;
            // check we have a valid oAuth token
            if (user && user.accessToken) {
                // try to fecth guildInfo                
                UserGuildInfo = await fetchUserGuildInfo(currentGuild, session.user.accessToken)
                    .catch((err) => { return reject(err) })
                // ensure we got a response from fetchUserGuildInfo()
                if (UserGuildInfo != null || undefined) {
                    // ensure we got a roles list from fetchUserGuildInfo()
                    if (UserGuildInfo.roles) {
                        const { roles } = UserGuildInfo
                        UserRoleInfo = await mapUserRoles(roles, currentGuild)
                        return resolve({ guildInfo: UserGuildInfo, roleInfo: UserRoleInfo })
                    } else {
                        return reject(`failed fetching roles for guild: ${currentGuild}`)
                    }
                }
            } else {
                // no authToken
                return reject('accessToken not found for current session')
            }
        } else {
            // no session
            return reject('No Session')
        }
    });
}
