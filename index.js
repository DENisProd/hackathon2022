const app = require('fastify')({logger: true})

require('dotenv').config()
require('./db/db')

app.register(require('fastify-cors'), {})
app.register(require('fastify-jwt'), {
    secret: process.env.SECRET_KEY
})
app.register(require('./routes/RoutesControll'))

const PORT = process.env.PORT

const start = async() => {
    try {
        await app.listen(PORT)
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}
start()

