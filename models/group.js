const mongoose = require('mongoose')

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    public: { type: Boolean, required: true},
    members: {
        type: Map,
        of: String,
        required: true
    }
})

const Group = mongoose.model('Group', GroupSchema)

module.exports = exports = Group
