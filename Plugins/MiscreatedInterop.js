// Theros#7648 @ SvalTek
// ──────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: M I S C R E A T E D   I N T E R O P : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────
// Handles interaction Between MisCord and Miscreated Server Instances over RCON

const { promiseRetry } = require("../util/BotUtils")

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
     * 
     * @param {Number} nTries incase of Error 503 retry this many times default 3
     * @returns {Promise}
     */
    async getStatus(nTries) {
        const request = async () => {
            return await this.server.getStatus()
                .then((result) => {
                        console.log(`getStatus() >> We got All the Datas, Success fetching server Status`)
                        console.log(result);
                        return Promise.resolve(result)
                })
                .catch((err) => {
                    if (err.response && err.response.status == 503) {
                        const msg = `getStatus() >> ${err.response.statusText}, retrying its just in use....`
                        console.warn(msg)
                        return Promise.reject(Error(msg))
                    } else {
                    console.log(`getStatus() >> failed fetching server Status... Boooo!`)
                    console.log(err);
                    return Promise.reject(err)
                    }
                })
        }
        return promiseRetry(request,nTries||3)
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
     * * isWhitelistedSteam64(steamId)
     * checks if steamid is present in servers whitelist
     * @param {string} steamId 
     * @returns {boolean} isWhitelisted
     */
    async isWhitelistedSteam64(steamId) {
        return this.getWhitelist().then(whitelist => {
            return whitelist.includes(steamId)
        })
    }

    /**
     * * whitelistPlayer(steamId)
     * add a player to whitelist by steamId
     * @param {string} steamId 
     * @returns {boolean} whitelist added
     * @returns {string} message
     */
    async whitelistPlayer(steamId, debug) {
        let whitelistAdded,
            msgResult = "unknown error";

        try {
            const remote_result = await this.server.send('mis_whitelist_add ' + steamId)
                .then((remote_result) => { return remote_result })
                .catch(err => {
                    return error(err)
                })

            // try to validate the steamid was correctly added
            const isWhitelisted = await this.isWhitelistedSteam64(steamId)
                .then((whitelisted) => { return whitelisted })
                .catch(err => { return error(err) })

            if (isWhitelisted) {
                whitelistAdded = true
                msgResult = "player added to whitelist"
            } else {
                whitelistAdded = false
                msgResult = "failed adding player to whitelist"
            }
        }
        catch (error) {
            return false, error
        }

        return whitelistAdded, msgResult
    }
    /**
     * * unwhitelistPlayer(steamId)
     * remove a players from whitelist by steamId
     * @param {string} steamId 
     * @returns {boolean} whitelist removed
     * @returns {string} message
     */
    async unwhitelistPlayer(steamId, debug) {
        let whitelistRemoved,
            msgResult = "unknown error";

        try {
            const remote_result = await this.server.send('mis_whitelist_remove ' + steamId)
                .then((remote_result) => { return remote_result })
                .catch(err => {
                    return error(err)
                })

            // try to validate the steamid was correctly added
            const stillWhitelisted = await this.isWhitelistedSteam64(steamId)
                .then((whitelisted) => { return whitelisted })
                .catch(err => { return error(err) })

            if (!stillWhitelisted) {
                whitelistRemoved = true
                msgResult = "player removed from whitelist"
            } else {
                whitelistRemoved = false
                msgResult = "failed removing player from whitelist"
            }
        }
        catch (error) {
            return false, error
        }

        return whitelistRemoved, msgResult
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
     * * isBannedSteam64(steamId)
     * checks if steamid is present in servers banlist
     * @param {string} steamId 
     * @returns {boolean} isBanned
     */
    async isBannedSteam64(steamId) {
        return this.getBanlist().then(banlist => {
            return banlist.includes(steamId)
        })
    }


    /**
     * * banPlayer(steamId)
     * add a player to banlist by steamId
     * @param {string} steamId 
     * @returns {boolean} ban added
     * @returns {string} message
     */
    async banPlayer(steamId, debug) {
        let banAdded,
            msgResult = "unknown error";

        try {
            const remote_result = await this.server.send('mis_ban_add ' + steamId)
                .then((remote_result) => { return remote_result })
                .catch(err => {
                    return error(err)
                })

            // try to validate the steamid was correctly added
            const isBanned = await this.isWhitelistedSteam64(steamId)
                .then((banned) => { return banned })
                .catch(err => { return error(err) })

            if (isBanned) {
                banAdded = true
                msgResult = "player added to whitelist"
            } else {
                banAdded = false
                msgResult = "failed adding player to whitelist"
            }
        }
        catch (error) {
            return false, error
        }

        return banAdded, msgResult
    }
    /**
     * * unbanPlayer(steamId)
     * remove a players from banlist by steamId
     * @param {string} steamId 
     * @returns {boolean} ban removed
     * @returns {string} message
     */
    async unbanPlayer(steamId, debug) {
        let banRemoved,
            msgResult = "unknown error";

        try {
            const remote_result = await this.server.send('mis_ban_remove ' + steamId)
                .then((remote_result) => { return remote_result })
                .catch(err => {
                    return error(err)
                })

            // try to validate the steamid was correctly added
            const stillBanned = await this.isBannedSteam64(steamId)
                .then((banned) => { return banned })
                .catch(err => { return error(err) })

            if (!stillBanned) {
                banRemoved = true
                msgResult = "player removed from whitelist"
            } else {
                banRemoved = false
                msgResult = "failed removing player from whitelist"
            }
        }
        catch (error) {
            return false, error
        }

        return banRemoved, msgResult
    }


    //
    // ───────────────────────────────────────────────────────────── SERVER TOOLS ─────
    //
    /**
     * send ingame Chat message as this Server
     * @param {string} message message to send
     */
    async sendMessage(message) {
        if (message) {
            return await this.server.send(`sv_say ${message}`)
        }
    }

    /**
     * send a restart request to this server, optionaly sends message announcement
     * @param {string} restartTime Time until restart in Minutes (must be a string) default 1min
     * @param {string} restartMessage optional Restart Announcement
     */
    async restartServer(restartTime, restartMessage) {
        let time = parseInt(restartTime || "1") * 60
        restartTime = time.toString()
        if (restartMessage != null) {
            await this.sendMessage(restartMessage)
        }
        return await this.server.send(`do_shutdown ${restartTime}`)
    }
}