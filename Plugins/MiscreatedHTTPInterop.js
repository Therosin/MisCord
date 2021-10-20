// Theros#7648 @ SvalTek
// ──────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: M I S C R E A T E D   I N T E R O P : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────
// Handles interaction Between MisCord and Miscreated Server Instances over HTTP or RCON

//const axios = require(axios)
const axios = require("axios");
const Util = require("../util/BotUtils")
module.exports = class MiscreatedInterop {
    /**
     * Create a new MisHTTP object for this server
     * @param {string} server_ip 
     * @param {string} server_rconport 
     * @param {string} server_authkey
     */
    constructor(server_ip, server_rconport, server_authkey) {
        this.apiKey = server_authkey
        // Create ApiObject
        this.server = new axios.create({
            baseURL: `http://${server_ip}:${server_rconport}`,
            timeout: 2500,
            headers: { 'X-ClientId': 'MisCord_HTTPInterop_v0.1alpha' }
        });
    }

    getData(endpoint, params, tryAuth) {
        let param_payload = ""
        params = params || {}
        if (tryAuth) { params.auth_key = this.apiKey };
        let paramJSON = JSON.stringify(params);
        if (paramJSON != {} || null) { param_payload = "?" + Util.hexEncode(paramJSON) };
        return new Promise(async (resolve, reject) => {
            const response = await this.server.get(`${endpoint}${param_payload}`, {
                transformResponse: [function (data) {
                    let jsonData
                    try {
                        jsonData = JSON.parse(data);
                    } catch (error) {
                        console.error(err);
                        return reject(`failed Proccessing API Response response: ${data}\n Error: ${err}`)
                    }
                    if (!jsonData && jsonData.status) { return reject(`Unknown Response From API`) }
                    return jsonData.data || jsonData
                }]
            })
            let data = response.data || response
            resolve(data.result || data)
        })
    }

    /**
    ** fetch this Servers Status
     * @returns {Promise} (response) => { }
    */
    async getStatus() {
        return await this.getData("server")
    }

    /**
    ** fetch current player locations 
     * @param {steamId} player_steam64Id
     * @returns {Promise} (response) => { }
    */
    async getPlayerLocations(player) {
        let params = {}
        if (player != null) { params.player = player };
        return await this.getData('locationInterop/locations/players', params, true)
    }

    /**
    ** fetch current player base locations
     * @param {steamId} player_steam64Id
     * @returns {Promise} (response) => { }
    */
    async getBaseLocations(player) {
        let params = {}
        if (player) { params.player = player };
        return await this.getData('locationInterop/locations/bases', params, true)
    }
    /**
    ** fetch current airdrop locations
     * @returns {Promise} (response) => { }
    */
    async getAirdropLocations() {
        return await this.getData('locationInterop/locations/air-drops', {}, true)
    }

    /**
    ** fetch current planeCrash locations
     * @returns {Promise} (response) => { }
    */
    async getPlaneCrashLocations() {
        return await this.getData('locationInterop/locations/air-crash', {}, true)
    }

    /**
    ** fetch current player tent locations
     * @param {steamId} player_steam64Id
     * @returns {Promise} (response) => { }
    */
    async getTentLocations(player) {
        let params = {}
        if (player) { params.player = player };
        return await this.getData('locationInterop/locations/players', params, true)
    }
}