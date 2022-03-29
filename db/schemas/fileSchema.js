const mongoose = require('mongoose')

const fileSchema = mongoose.Schema({
    users: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users'
    }],
    name: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    value: {
        type: String
    },
    type: {
        type: String,
        default: 'file'
    }
})

const File = mongoose.model('files', fileSchema)

module.exports = File