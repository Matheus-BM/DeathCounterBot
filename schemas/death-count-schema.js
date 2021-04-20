const mongoose = require('mongoose');

const deathCountSchema = mongoose.Schema({
    // The user ID
    _id: {
        type: String,
        require: true
    },

    //How many deaths

    deathCount: {
        type: Number,
        require: true
    }

})

module.exports = mongoose.model('deathCount', deathCountSchema)

