const ServerModel = require('../Models/server')


module.exports = class ServerController {
    constructor(client) {
        this.client = client;
    }

    addServer(server_id) {
        return new Promise(async (resolve, reject) => {
            if (!server_id) { reject("missing server_id") }
            const doc = new ServerModel({ id: server_id })
            resolve(await doc.save())
        })
    }

    getServer(server_id) {
        return new Promise(async (resolve, reject) => {
            if (!server_id) { reject("missing server_id") }
            const server = await ServerModel.findOne({ id: server_id })
            if (!server) {
                reject("that server does not exist")
            } else {
                resolve(server)
            }
        })
    }
}