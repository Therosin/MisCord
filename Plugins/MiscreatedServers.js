module.exports = class MiscreatedServers {
    constructor(client) {
        this.client = client;
    }

    getServer(guild, server) {
        let is_ID
        if (server.server_id) { is_ID = true } else { is_ID = false };

        let data
        return new Promise(async (fulfill, reject) => {
            try {
                if (is_ID == true) {
                    // find server by guild and serverId
                    fulfill(
                        await this.client.database.connection.get(
                            'SELECT * FROM "servers" WHERE guild = $guild AND server_id = $server_id',
                            { $guild: guild, $server_id: server.server_id })
                    )
                } else {
                    // find server based on guild + provided server data
                    fulfill(
                        await this.client.database.connection.get(
                            'SELECT * FROM "servers" WHERE guild = $guild AND server_ip = $server_ip AND server_gameport = $server_gameport',
                            { $guild: guild, $server_ip: server.ip, $server_gameport: server.gameport })
                    )
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    getServers(guild) {
        return new Promise(async (fulfill, reject) => {
            try {
                fulfill(
                    await this.client.database.connection.all('SELECT * FROM "servers" WHERE guild = $guild ORDER BY id DESC', { $guild: guild })
                );
            } catch (err) {
                reject(err);
            }
        });

    }

    addServer(guild, server) {
        this.getServer(guild, server)
            .then(data => {
                if (!data) {
                    return new Promise(async (fulfill, reject) => {
                        try {
                            fulfill(await this.client.database.connection.run(
                                'INSERT INTO "servers"( guild, server_id, server_name, server_ip, server_gameport, server_rconport, server_password, server_authkey ) VALUES( $guild, $server_id, $server_name, $server_ip, $server_gameport, $server_rconport, $server_password, $server_authkey)',
                                {
                                    $guild: guild,
                                    $server_id: server.id,
                                    $server_name: server.name,
                                    $server_ip: server.ip,
                                    $server_gameport: server.gameport,
                                    $server_rconport: server.rconport,
                                    $server_password: server.password,
                                    $server_authkey: server.authkey
                                }));
                        } catch (err) {
                            reject(err);
                        }
                    });
                } else {
                    return false, "server exists"
                }
            })
    }

    delServer(guild, serverId) {
        let server = {
            server_id: serverId
        }
        this.getServer(guild, server)
            .then(found => {
                return new Promise(async (fulfill, reject) => {
                    if (found == undefined || found.server_id !== serverId) {
                        reject("server not found")
                    }
                    try {
                        fulfill(await this.client.database.connection.run('DELETE FROM "servers" WHERE guild=$guild AND server_id=$server_id', { $guild: guild, $server_id: found.server_id }));
                    } catch (err) {
                        reject(err);
                    }
                });
            }).catch(err => {
                return err
            })
    }
}