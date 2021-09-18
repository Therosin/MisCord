// Theros#7648 @ SvalTek
// ──────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: M I S C R E A T E D   S E R V E R S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────
// Handles management of MongoDB Database Entries for each Guilds Miscreated Servers.

module.exports = class MiscreatedServers {
    constructor(client) {
        this.client = client;
    }


    /**
     * returns the total number of managed servers (optionaly returns only servers registered for a specified guild)
     * @param {string} guild guildId of guild to fetch serverCount for . or all guilds
     */
    getServerCount(guild) {
        return new Promise(async (fulfill, reject) => {
            try {

                // try to fetch server count
                fulfill(
                    await this.client.db.ServerController.getServerCount(guild)
                )
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * find a specific server by guildId and server Object
     * @param {string} guild guildId of guild to fetch a server for
     * @param {object} server and object defining properties to filter by
     */
    getServer(guild, server) {
        return new Promise(async (fulfill, reject) => {
            try {

                // find server based on guild + provided server data
                fulfill(
                    await this.client.db.ServerController.getServer(guild, server)
                )
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * fetch all servers belonging to a guild
     * @param {string} guild guildId to fetch servers for
     */
    getServers(guild) {
        return new Promise(async (fulfill, reject) => {
            try {

                // find all servers based on guild
                fulfill(
                    await this.client.db.ServerController.getServers(guild)
                )
            } catch (err) {
                reject(err);
            }
        });

    }

    /**
     * Create a new Server
     * @param {string} guild 
     * @param {object} server {ip,name,gameport,rconport,rconpass,secret: string}
     */
    addServer(guild, server) {
        let server_data = {
            server_ip: server.ip,
            server_gameport: server.gameport
        }
        return new Promise(async (fulfill, reject) => {
            this.getServer(guild, server_data)
                .then(async found => {
                    if (found) {
                        reject("server exists")
                    } else {
                        try {
                            server.id = Math.random().toString(36).slice(-6);
                            console.log(`creating new server: ${server.id}`)
                            fulfill(await this.client.db.ServerController.addServer(guild, server))
                        } catch (err) {
                            console.error(`failed to create server: ${err}`)
                            reject(err);
                        }
                    }
                });
        })
    }

    /**
     * delete a server by guildId and serverId
     * @param {string} guild guildId of guild that owns the server
     * @param {string} serverId serverId of the server to delete
     */
    delServer(guild, serverId) {
        let server = {
            server_id: serverId
        }
        return new Promise(async (fulfill, reject) => {
            this.getServer(guild, server)
                .then(async found => {
                    if (found == undefined || found.server_id !== serverId) {
                        reject("server not found")
                    }
                    try {
                        fulfill(await this.client.db.ServerController.delServer(guild, serverId))
                    } catch (err) {
                        reject(err);
                    }
                });
        })
    }
}