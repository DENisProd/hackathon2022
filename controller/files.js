const User = require('../db/schemas/userSchema')
const File = require('../db/schemas/fileSchema')
const Storage = require('../db/schemas/storageSchema')
const bcrypt = require('bcrypt')
const send = require('../utils/Utills')
const mongoose = require("mongoose");
const uuid = require('uuid').v4
const cryptico = require('cryptico')
const rsa = require('node-rsa')


const updateValueInFile = async (req, reply) => {
    if (!req.body || !req.body.name || !req.params.fileId || !req.body.value)
        return send(reply, 206, {message: 'Данные не заполнены'})

    const token = req.headers.authorization.toString().replace("Bearer ", "")
    console.log(token)

    const fileFromDb = await File.findOneAndUpdate({_id: req.params.fileId}, 
        {
            $set: {
                name: require("../utils/Crypta").aesDecrypt(req.body.name, token),
                value: require("../utils/Crypta").aesDecrypt(req.body.value, token)
            }
        })
    return send(reply, 206, {message: 'Данные заполнены'})

}

const createFile = async (req, reply) => {
    if (!req.body || !req.body.name || !req.params.storageId || !req.body.value)
        return send(reply, 206, {message: 'Данные не заполнены'})

    const fileFromDb = await File.findOne({name: req.body.name}).exec()
    if(fileFromDb) {
        return send(reply, 206, {message: 'Файл уже существует', success: false})
    } else {
        new_file = new File({
            name: req.body.name,
            value: req.body.value,
            users: [req.user._id]
        }) 
        try {
            await new_file.save();
            const new_file_fromdb = await File.findOne({name: req.body.name})
            const updatedStorage = await Storage.findOneAndUpdate(
                {_id: req.params.storageId},
                {$push: {
                    childrens_files: new_file_fromdb.id
                }},
                {new: true}
            )

            send(reply, 201, {message: 'Файл создан', success: true})

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
}*/

const deleteFile = async (req, reply) => {
    if (!req.params.fileId) {
        return send(reply, 206, {message: 'Данные не заполнены', success: false})
    } else {
        try {
            const fileFromDb = await File.findById(req.params.fileId)
            const code = fileFromDb._id
            File.deleteOne({id: req.params.fileId}, function(err, result){
                //if(result) send(reply, 200, {message: 'Роль удалена', success: true})
                console.log("deleted")
            })
            const updatedStorage = await Storage.findOneAndUpdate(
                {_id: req.params.storageId},
                {$pull: {
                    childrens_files: fileFromDb._id}
                }
            )
            send(reply, 200, {message: 'Файл удален', success: true})
            

        } catch (e) {
            return send(reply, 206, {message: 'Ошибка: ' + e})
        }
    }
}

module.exports = {
    createFile,
    deleteFile,
    updateValueInFile
}