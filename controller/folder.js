const User = require('../db/schemas/userSchema')
const File = require('../db/schemas/fileSchema')
const Storage = require('../db/schemas/storageSchema')
const Folder = require('../db/schemas/folderSchema')
const bcrypt = require('bcrypt')
const send = require('../utils/Utills')
const mongoose = require("mongoose");
const uuid = require('uuid').v4
const cryptico = require('cryptico')
const rsa = require('node-rsa')

const createFolder = async (req, reply) => {
    if (!req.body || !req.body.name || !req.params.storageId)
        return send(reply, 206, {message: 'Данные не заполнены'})

    const folderFromDb = await Folder.findOne({name: req.body.name}).exec()
    if(folderFromDb) {
        return send(reply, 206, {message: 'Папка уже существует', success: false})
    } else {
        new_folder = new Folder({
            name: req.body.name,
            users: [req.user._id]
        }) 
        try {
            await new_folder.save();
            const new_folder_fromdb = await Folder.findOne({name: req.body.name})
            const updatedStorage = await Storage.findOneAndUpdate(
                {_id: req.params.storageId},
                {$push: {
                    childrens_folders: new_folder_fromdb.id
                }},
                {new: true}
            )

            send(reply, 201, {message: 'Папка создана', success: true})

        } catch (e) {
            return send(reply, 400, {message: 'Ошибка: ' + e})
        }
    }
}

/*
const getAllRoles = async (req, reply) => {
    const roles = await Role.find({})

    if (roles)
        return roles
    else
        return "Ролей ещё нет"
}

const deleteRole = async (req, reply) => {
    if (!req.params.roleId) {
        return send(reply, 206, {message: 'Данные не заполнены', success: false})
    } else {
        try {
            Role.deleteOne({id: req.params.roleId}, function(err, result){
                if(result) send(reply, 200, {message: 'Роль удалена', success: true})
            })

        } catch (e) {
            return send(reply, 206, {message: 'Ошибка: ' + e})
        }
    }
}*/

const deleteFolder = async (req, reply) => {
    if (!req.params.folderId) {
        return send(reply, 206, {message: 'Данные не заполнены', success: false})
    } else {
        try {
            const folderFromDb = await Folder.findById(req.params.folderId)
            Folder.deleteOne({id: req.params.folderId}, function(err, result){
                //if(result) send(reply, 200, {message: 'Роль удалена', success: true})
                console.log("deleted")
            })
            /*const updatedStorage = await Storage.findOneAndUpdate(
                {_id: req.params.storageId},
                {$pull: {
                    childrens_files: folderFromDb._id}
                }
            )*/
            send(reply, 200, {message: 'Папка удалена', success: true})
            

        } catch (e) {
            return send(reply, 206, {message: 'Ошибка: ' + e})
        }
    }
}

const getFolders = async (req, reply) => {
    if (!req.params.storageId) {
        return send(reply, 206, {message: 'Данные не заполнены (необходим storageID)', success: false})
    } else {
        try {
            const foldersFromDb = await Storage.find({_id: req.params.storageId}).populate('childrens_files').populate('childrens_folders')
            let data = []
            foldersFromDb.forEach(element => {
                element.childrens_files.forEach(el => {
                    data.push({
                        id: el._id,
                        value: el.value,
                        type: el.type,
                        created: el.created,
                        name: el.name
                    })
                })
                element.childrens_folders.forEach(el => {
                    data.push({
                        id: el._id,
                        type: el.type,
                        created: el.created,
                        name: el.name
                    })
                })
            });

            send(reply, 200, {success: true, data})

        } catch (e) {
            return send(reply, 206, {message: 'Ошибка: ' + e})
        }
    }
}

module.exports = {
    createFolder,
    getFolders,
    deleteFolder
}