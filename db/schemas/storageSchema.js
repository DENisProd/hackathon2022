const mongoose = require('mongoose')

const storageSchema = mongoose.Schema({
    name: {
        type: String
    },
    childrens_folders: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'folder',
    }],
    childrens_files: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'files',
    }],
    users: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users'
    }],
    type: {
        type: String,
        default: "storage"
    }
})

const Storage = mongoose.model('storage', storageSchema)

module.exports = Storage