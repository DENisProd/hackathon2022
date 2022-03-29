const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    nickname: {
        type: String,
        trim: true,
        unique: true,
        required: 'Email address is required'
    },
    email: {
        type: String,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        default: ""
    },
    created: {
        type: Date,
        default: Date.now
    },
    enter_history: [
        {
            user_agent: {
                type: String,
                default: ''
            },
            ip_address: {
                type: String,
                default: ''
            },
            country: {
                type: String,
                default: ''
            }
        }
    ],
    master_password: {
        type: String,
    },
    roles: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'role'
    }],
    private_key: {
        type: String
    },
    public_key: {
        type: String
    }
})

const User = mongoose.model('users', userSchema)

module.exports = User