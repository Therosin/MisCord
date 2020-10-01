const GuildModel = require('../Models/Guild')


module.exports = class GuildController {
    constructor(client) {
        this.client = client;
    }

    addGuild(guild_id) {
        return new Promise(async (resolve, reject) => {
            if (!guild_id) { reject("missing guild_id") }
            const doc = new GuildModel({ id: guild_id })
            resolve(await doc.save())
        })
    }

    getGuild(guild_id) {
        return new Promise(async (resolve, reject) => {
            if (!guild_id) { reject("missing guild_id") }
            const guild = await GuildModel.findOne({ id: guild_id })
            if (!guild) {
                reject("that guild does not exist")
            } else {
                resolve(guild)
            }
        })
    }
}