// Theros#7648 @ SvalTek
// ────────────────────────────────────────────────────────────── I ──────────
//   :::::: S T E A M W E B A P I : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────
// Handles making requests to SteamWebapi for getting player Profile info

"use strict"

const SteamAPI = require("steamapi")
require('dotenv').config()

const APIKEY = process.env.STEAM_APIKEY

module.exports = class SteamWebApi {
    /**
     * create a new SteamWebApi Interface
     * @param {*} client 
     */
    constructor(client) {
        // Create ApiObject
        this.client = client
        this.steam = new SteamAPI(APIKEY)
    }

    /**
     * feth a players SteamProfile
     * @param {string} steamId 
     */
    getSteamProfile(steamId) {
        return new Promise((resolve, reject) => {
            this.steam.getUserSummary(steamId).then(profile => {
                if (profile && profile.nickname) {
                    resolve(profile)
                } else {
                    reject(`Failed to fetch SteamProfile for: ${steamId}`)
                }
            })
        })
    }

    /**
     * fetch a players SteamBans
     * @param {string} steamId 
     */
    getSteamBans(steamId) {
        return new Promise((resolve, reject) => {
            this.steam.getUserBans(steamId).then(banlist => {
                if (banlist) {
                    resolve(banlist)
                } else {
                    reject(`Failed to fetch SteamBans for: ${steamId}`)
                }
            })
        })
    }

    /**
     * fetch a players gamestats
     * @param {string} steamId 
     */
    getSteamGameStats(steamId) {
        const gameAppId = "299740"
        return new Promise((resolve, reject) => {
            this.steam.getUserStats(steamId, gameAppId).then(GameStats => {
                if (GameStats) {
                    resolve(GameStats)
                } else {
                    reject(`Failed to fetch GameStats for: ${steamId}`)
                }
            })
        })
    }
}
