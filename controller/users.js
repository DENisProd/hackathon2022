const User = require('../db/schemas/userSchema')
const bcrypt = require('bcrypt')
const send = require('../utils/Utills')
const mongoose = require("mongoose");
const uuid = require('uuid').v4
const cryptico = require('cryptico')
const rsa = require('node-rsa')
const crypto = require('crypto')





const addMasterPassword = async (req, reply) => {
    if (!req.body || !req.body.master_key) {
        return send(reply, 206, {message: 'Данные не заполнены', success: false})
    }
    else {
        //const user = await User.findOne({id: req.user._id.toString()}).exec()
        //console.log

        User.findByIdAndUpdate({_id: req.user._id},
            {
                $set: {
                    master_password: req.body.master_key
                }
            },
            function (error, success) {
                if (error) console.log(error)
                if (success) {
                    return send(reply, 201, {message: 'Вы успешно', success: true, user:success})
                }
            }
                )
        //const user = await User.findOne({id: req.user._id.toString()}).exec()

        

        //console.log(user)
        //return user
        /*else
        {
            return send(reply, 206, {message: 'ошибка сервера', success: false})
        }*/
    }
}

const changeImage = async (req, reply) => {
    if (req.body || req.body.new_img) {
        return send(reply, 206, {message: 'Данные не заполнены', success: false})
    }
    else {
        const user = await User.findOne({id: req.user._id.toString()}).exec()
        if (user) {
            user.set({img:req.body.new_img})
            await user.save()
        }
        else
        {
            return send(reply, 206, {message: 'ошибка сервера', success: false})
        }
    }
}

const checkToken = async (req, reply) => {
    const user = await User.findOne({_id: req.user._id}).exec()
    const new_enter = {
        user_agent: req.headers['user-agent'],
        ip_address: req.ip,
        country: ''
    }
    if (user) {
        let data;
        data = {
            id: req.user._id.toString(),
            nickname: user.nickname,
            img: user.img,
            email: user.email,
            createdRooms: user.createdRooms,
            created: user.created,
            pub_key: user.public_keys,
            new_enter: new_enter
        }
        send(reply, 201, {success: true, data})
    } else {
        return send(reply, 206, {message: 'Пользователь не найден', success: false})
    }
}

const getProfile = async (req, reply) => {
    
}

const register = async (req, reply) => {
    if (!req.body.email || !req.body.nickname || !req.body.password)
        return send(reply, 206, {message: 'Данные не заполнены'})

    const candidate = await User.findOne({email: req.body.email});

    if (candidate)
        return send(reply, 400, {message: 'Пользователь существует'})
    else {
        const candidate2 = await User.findOne({nickname: req.body.nickname});
        if (candidate2)
            return send(reply, 400, {message: 'Пользователь существует'})

        // Нужно создать пользователя
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password;
        const user = new User({
            email: req.body.email,
            nickname: req.body.nickname,
            password: bcrypt.hashSync(password, salt)
        })
        try {
            await user.save();
            send(reply, 201, {message: 'Вы успешно зарегистрировались', success: true})

        } catch (e) {
            send(reply, 400, {message: 'Ошибка: ' + e})
        }

    }
}

const login = async (req, reply, var_jwt) => {
    if (!req.body.email || !req.body.password)
        return send(reply, 206, {message: 'Данные не заполнены'})

    const password = req.body.password

    const user = await User.findOne({email: req.body.email})
    if (!user)
        return send(reply, 400, {message: 'Пользователя с такой почтой не существует'})

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        return send(reply, 400, {message: "Пароли не совпадают"})
    }

    const new_enter = {
        user_agent: req.headers['user-agent'],
        ip_address: req.ip,
        country: ''
    }

    //let secret = require('../utils/config').SECRET_KEY.toString()

    /*let key = new rsa().generateKeyPair()

    let private_key = key.exportKey("private")
    let public_key = key.exportKey("public")
    //let Bits = 1024;
    
    //let private_key1 = key.importKey(private_key)
    //let public_key1 = key.importKey(public_key)
    console.log(private_key)*/

    let private_key = null, public_key = null

    User.findOneAndUpdate({_id: user._id}, {
            $push: {
                enter_history: new_enter
            },
            $set: {
                private_key: private_key,
                public_key: public_key
            }
        },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {

            }
        })

    const token = var_jwt.sign({
        _id: user._id,
        nickname: user.nickname
    })


    //let privateRSAkey = cryptico.generateRSAKey(secret, Bits);
    //let publicRSAkey = cryptico.publicKeyString(privateRSAkey);

    /*let PlainText2 = "Matt, I need you to help me with my Starcraft strategy."

    let cryptedText = private_key1.encrypt(PlainText, "base64")
    console.log(cryptedText)
    let decrypted = public_key1.decrypt(cryptedText, "utf8")
    console.log(decrypted)
    console.log("============")
    let cryptedText2 = public_key1.encrypt(PlainText, "base64")
    console.log("Crypted:   " + cryptedText2)
    let decrypted2 = private_key1.decrypt(cryptedText2, "utf8")
    console.log("Decrypted:   " + decrypted2)*/

    /*crypt: {
        public: public_key,
        uuid: uuid(),
        user_agent: req.headers['user-agent'],
        ip_address: req.ip,
    }*/
    let PlainText = "Matt, I need you to help me with my Starcraft strategy."
    const Securitykey = crypto.randomBytes(32);
    const aes = require("../utils/AEScipher").aesEncode(PlainText, Securitykey)
    console.log(aes)
    const ivurl = "sh43OuEzXjPix28dP2imNQ=="

    //const aes2 = require("../utils/AEScipher").aesDecode(aes.encryptedData, Securitykey, ivurl)



    const response_user = {
        id: user._id,
        nickname: user.nickname,
        created_rooms: user.createdRooms,
        img: user.img,
        email: user.email,
        haveKey: user.master_key ? true : false,
        aes: aes,
        pub_key: user.public_key,
        aboba: require("../utils/AEScipher").base64encode(PlainText)
    }

    return send(reply, 201, {message: 'Вы успешно авторизировались', success: true, response_user, token})
}

const getAllUsers = async (req, reply) => {
    const users = await User.find({})

    if (users)
        return users
    else
        return "Пользователей ещё нет"
}

module.exports = {
    register,
    login,
    getProfile,
    checkToken,
    changeImage,
    addMasterPassword,
    getAllUsers
}