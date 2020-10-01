const { Schema, model } = require('mongoose');


const Server = new Schema({
  id: String,
  guild: String,
  server_id: String,
  server_name: String,
  server_ip: String,
  server_gameport: String,
  server_rconport: String,
  server_password: String,
  server_authkey: String,
});

module.exports = model('Server', Server)