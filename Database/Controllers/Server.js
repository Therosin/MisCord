const ServerModel = require('../Models/Servers')
const Utils = require("../../util/BotUtils")
require('dotenv').config()
let secret = "SomeRealyLongSecretString0x02021"

module.exports = class ServerController {
    constructor(client) {
        this.client = client;
        // we can fail gracefully and fall back on Default SECRET Defined above
        // this does pose a security risk allowing multiple instances to share a db_secret
        // but honestly this should be fine as one would have to gain access to the db in the first instance
        secret = process.env.SECRET || secret;
    }

    addServer(guild, server) {
        return new Promise(async (resolve, reject) => {
            if (!guild) { reject("missing guild") }
            const doc = new ServerModel({
                guild: guild,
                server_id: server.id,
                server_name: server.name,
                server_ip: server.ip,
                server_gameport: server.gameport,
                server_rconport: server.rconport,
                server_password: Utils.encrypt_data(server.password, secret),
                server_authkey: Utils.encrypt_data(server.authkey, secret)
            })

            await doc.save()
                .then(saved => {
                    const new_server = saved.toObject()
                    if (new_server && new_server.server_id === server.id) {
                        resolve(saved.server_id)
                    } else {
                        reject("Error Saving Data, [serverId not match]")
                    }
                })
                .catch(err => {
                    reject(`Error in SaveData: ${err}`)
                })
        })
    }

    getServerCount(guild) {
        return new Promise((resolve, reject) => {
            ServerModel.estimatedDocumentCount()
                .then(docCount => {
                    resolve(docCount)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    getServers(guild) {
        return new Promise(async (resolve, reject) => {
            if (!guild) { reject("missing guild") }
            const servers = await ServerModel.find({ guild: guild })
            if (!servers) {
                reject(servers)
            } else {
                resolve(servers)
            }
        })
    }

    getServer(guild, server_data) {
        return new Promise(async (resolve, reject) => {
            if (!guild) { reject("missing guild") }
            const server = await ServerModel.findOne({ guild: guild, ...server_data })
            if (!server) {
                resolve(server)
            } else {
                server.server_password = Utils.decrypt_data(server.server_password, secret)
                server.server_authkey = Utils.decrypt_data(server.server_authkey, secret)
                resolve(server)
            }
        })
    }

    delServer(guild, server_id) {
        return new Promise(async (resolve, reject) => {
            if (!guild) { reject("missing guild") }
            if (!server_id) { reject("missing server_id") }
            const server = await ServerModel.findOne({ server_id: server_id })
            if (!server) {
                reject("that server does not exist")
            } else {
                resolve(await server.remove())
            }
        })
    }
}