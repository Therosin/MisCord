/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const { connect } = require('mongoose')

require('dotenv').config()
const MONGOCFG = {
    URI = process.env.MONGO_URI,
    DBNAME = process.env.MONGO_DBNAME,
    USER = process.env.MONGO_USER,
    PASSWORD = process.env.MONGO_PASSWORD
}

const GuildController = require('./Controllers/Guild.js')
const ServerController = require('./Controllers/Server.js')


module.exports = class MongoDatabase {
    constructor(client) {
        this.client = client;
        (async () => {
            await connect(`mongodb+srv://${MONGOCFG.USER}:${MONGOCFG.PASSWORD}@${MONGOCFG.URI}/${MONGOCFG.DBNAME}?retryWrites=true&w=majority`
                , {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                    useCreateIndex: true
                })
        })().then(() => {
            this.lient.logger.info("[DATABASE] Connection to Database Succeded [MongoDB Connect]")
            this.GuildController = new GuildController(client)
            this.ServerController = new ServerController(client)
        }).catch(err => {
            this.client.logger.error(`[DATABASE] Connection Failed [MongoDB Connect]\n Reason: ${err}`)
        })
    }
};