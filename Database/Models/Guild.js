const { Schema, model } = require('mongoose');


const Guild = new Schema({
    id: String,
    prefix: {
        default: 'm>',
        type: String
    }
});

module.exports = model('Guild', Guild)