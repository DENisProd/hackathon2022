//mongod --ipv6

const mongoose = require('mongoose')
//mongoose.connect(process.env.WEB_DB, {
mongoose.connect(process.env.LOCAL_DB, {
    useNewUrlParser: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.log(error));