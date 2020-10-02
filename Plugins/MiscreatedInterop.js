// Theros#7648 @ SvalTek
// ──────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: M I S C R E A T E D   I N T E R O P : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────
// Handles interaction Between MisCord and Miscreated Server Instances over HTTP or RCON

"use strict";

//const axios = require(axios)
const misrcon = require("node-misrcon")
module.exports = class MiscreatedInterop {
    /**
     * Create a new misrcon object for this server
     * @param {string} server_ip 
     * @param {string} server_rconport 
     * @param {string} server_password 
     */
    constructor(server_ip, server_rconport, server_password) {
        // Create ApiObject
        this.server = new misrcon.NodeMisrcon({ ip: server_ip, port: server_rconport, password: server_password });
    }

    /**
     * get this Servers Status
     */
    async getStatus() {
        return await this.server.getStatus();
    }

    /**
     * get this Servers Stats
     */
    async getStats() {
        return await this.server.getStats();
    }


    //
    // ───────────────────────────────────────────────────── WHITELIST MANAGEMENT ─────
    //

    /**
     * get this Servers Whitelist
     */
    async getWhitelist() {
        return await this.server.getWhitelist();
    }

    /**
     * * whitelistPlayer(steamId)
     * add a player to whitelist by steamId
     * @param {string} steamId 
     */
    async whitelistPlayer(steamId) {
        return await this.server.send('mis_whitelist_add' + steamId)
    }
    /**
     * * unwhitelistPlayer(steamId)
     * remove a players from whitelist by steamId
     * @param {string} steamId 
     */
    async unwhitelistPlayer(steamId) {
        return await this.server.send('mis_whitelist_remove ' + steamId)
    }

    //
    // ─────────────────────────────────────────────────────── BANLIST MANAGEMENT ─────
    //

    /** 
     * * getBanlist()
     * get this Server Banlist
     */
    async getBanlist() {
        return await this.server.getBanList();
    }
    /**
     * * banPlayer(steamId)
     * ban a player by steamId
     * @param {string} steamId 
     */
    async banPlayer(steamId) {
        return await this.server.send('mis_ban_steamId ' + steamId)
    }
    /**
     * * unbanPlayer(steamId)
     * unban a player by steamId
     * @param {string} steamId 
     */
    async unbanPlayer(steamId) {
        return await this.server.send('mis_unban_steamId ' + steamId)
    }
}