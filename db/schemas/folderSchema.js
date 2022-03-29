const mongoose = require('mongoose')

const folderSchema = mongoose.Schema({
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
    children_files: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'files',
    }],
    type: {
        type: String,
        default: 'fold'
    }
})

const Folder = mongoose.model('folder', folderSchema)

module.exports = Folder