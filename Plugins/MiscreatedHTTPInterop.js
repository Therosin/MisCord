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
            timeout: 1000,
            headers: { 'X-ClientId': 'MisCord_HTTPInterop_v0.1alpha' }
        });
    }

    getData(endpoint, params, tryAuth) {
        let param_payload = ""
        if (params == null) {
            if (tryAuth) { params = { "authkey": this.apiKey} }
        }
        let paramJSON = JSON.stringify(params);
        if (paramJSON != null) {
            param_payload = "?" + Util.hexEncode(paramJSON)
        }

        return new Promise(async (resolve,reject) => {
            response = this.server.get(`${endpoint}${param_payload}`, {
                transformResponse: [function (data) {
                    return JSON.parse(data);
                }]
            })
                .catch(function (error) {
                    if (error.response) {
                        // server responded with a status code
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    } else if (error.request) {
                        // request was made but no response
                        console.log(error.request);
                    } else {
                        // setting up the request triggered an Error
                        console.log('Error', error.message);
                    }
                    console.log(error.config);
                    return reject(error)
                });

            resolve(response)
        })
    }

    /**
     * get this Servers Status
     */
    async getStatus() {
        return await this.getData("server")
    }
}