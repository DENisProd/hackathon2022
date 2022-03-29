const User = require('../db/schemas/userSchema')
const Role = require('../db/schemas/rolesSchema')
const bcrypt = require('bcrypt')
const send = require('../utils/Utills')
const mongoose = require("mongoose");
const uuid = require('uuid').v4
const cryptico = require('cryptico')
const rsa = require('node-rsa')

const addRole = async (req, reply) => {
    if (!req.body || !req.body.name)
        return send(reply, 206, {message: 'Данные не заполнены'})

    const roleFromDb = await Role.findOne({name: req.body.name}).exec()
    if(roleFromDb) {
        return send(reply, 206, {message: 'Роль уже существует', success: false})
    } else {
        new_role = new Role({
            name: req.body.name
        }) 
        try {
            await new_role.save();

            send(reply, 201, {message: 'Роль создана', success: true})

        } catch (e) {
            return send(reply, 400, {message: 'Ошибка: ' + e})
        }
    }
}

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
}

module.exports = {
    addRole,
    getAllRoles,
    deleteRole
}