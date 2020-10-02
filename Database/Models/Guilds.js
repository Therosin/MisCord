const { Schema, model } = require('mongoose');


const Guilds = new Schema({
    id: String,
    prefix: {
        default: 'm>',
        type: String
    }
});

module.exports = model('Guilds', Guilds,"Guilds")