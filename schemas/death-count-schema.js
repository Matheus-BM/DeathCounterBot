const mongoose = require('mongoose');

const deathCountSchema = mongoose.Schema({
    // user id
    userId: {
        type: String,
        require: true
    },

    //How many deaths

    deathCount: {
        type: Number,
        require: true
    },

    rageCount: {
        type: Number,
        require: true
    },
    // game name
    gameName: {
        type: String,
        require: true
    }

})

module.exports = mongoose.model('deathCount', deathCountSchema)

