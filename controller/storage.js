const User = require('../db/schemas/userSchema')
const Role = require('../db/schemas/rolesSchema')
const Storage = require('../db/schemas/storageSchema')
const bcrypt = require('bcrypt')
const send = require('../utils/Utills')
const mongoose = require("mongoose");
const uuid = require('uuid').v4
const cryptico = require('cryptico')
const rsa = require('node-rsa')
const CryptoJS = require("crypto-js");

const addUserToStorage = async (req, reply) => {
    if (!req.body || !req.body.userId || !req.params.storageId)
        return send(reply, 206, {message: 'Данные не заполнены'})

        try {
        const updatedStorage = await Storage.findOneAndUpdate(
            {_id: req.params.storageId},
            {$push: {
                users: req.body.userId
            }},
            {new: true}
        )
        send(reply, 201, {message: 'Новый пользователь в хранилище', success: true})
        } catch (e) {
            return send(reply, 400, {message: 'Ошибка: ' + e})
        }
}

const addStorage = async (req, reply) => {
    if (!req.body || !req.body.name)
        return send(reply, 206, {message: 'Данные не заполнены'})

    console.log(req.body)
    const storageFromDb = await Storage.findOne({name: req.body.name}).exec()
    if(storageFromDb) {
        return send(reply, 206, {message: 'Хранилище с таким названием уже существует', success: false})
    } else {
        new_storage = new Storage({
            name: req.body.name,
            users: [req.user._id]
        }) 
        try {
            await new_storage.save();

            send(reply, 201, {message: 'Хранилище создано', success: true})

        } catch (e) {
            return send(reply, 400, {message: 'Ошибка: ' + e})
        }
    }
}

const getAllStorages = async (req, reply) => {
    const storages = await Storage.find({}).populate('childrens_files').populate('childrens_folders')

    const token = req.headers.authorization.toString().replace("Bearer ", "")
    const datat = JSON.stringify(storages)
    const crypt = require("../utils/Crypta").aesEncrypt(datat, token).toString()
    //.toString(CryptoJS.enc.Utf8)
    if (storages)
        return {storages: crypt}
        //return {storages: datat}
    else
        return "Хранилищ ещё нет"
}

const deleteStorage = async (req, reply) => {
    if (!req.params.storageId) {
        return send(reply, 206, {message: 'Данные не заполнены', success: false})
    } else {
        try {
            Storage.deleteOne({_id: req.params.storageId}, function(err, result){
                if(result) send(reply, 200, {message: 'Хранилище удалено', success: true})
            })

        } catch (e) {
            return send(reply, 206, {message: 'Ошибка: ' + e})
        }
    }
}

const getStorages = async (req, reply) => {
    if (!req.params.userId) {
        return send(reply, 206, {message: 'Данные не заполнены (необходим :userId)', success: false})
    } else {
        const storages = await Storage.find({})
        
        if (storages) {
            let data = []
            storages.forEach(el => {
                data.push({
                    childrens_files: el.childrens_files,
                    childrens_folders: el.childrens_folders,
                    name: el.name,
                    type: el.type,
                    id: el._id
                })
            })
            return {success: true, data}
            //return {storages: datat}
        }   
        else
            return "Хранилищ ещё нет"
    }
}

module.exports = {
    addStorage,
    getAllStorages,
    deleteStorage,
    addUserToStorage,
    getStorages
}