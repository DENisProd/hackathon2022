const userController = require("../controller/users");

module.exports = function (fastify, options, done) {

    fastify.post('/api/user/login',
        function (req, reply) {
            return userController.login(req, reply, fastify.jwt)
        })

    fastify.post('/api/user/register',
        {
            schema: {
                body: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string',
                            pattern: "[a-z0-9]+@[a-z]+\\.[a-z]"
                        },
                        nickname: {
                            type: 'string',
                            minLength: 3
                        },
                        password: {
                            type: 'string',
                            minLength: 6
                        }
                    },
                    required: ['email', 'nickname', 'password'],
                    additionalProperties: false
                }
            }
        },
        function (req, reply) {
            return userController.register(req, reply)
        }
    )

    fastify.get('/', async function (req, reply) {
        reply.send({hello: 'world'})
    })

    fastify.get('/aboba/:params', options, function (request, reply) {
        console.log(request.headers['user-agent'])
        console.log(request.connection.remoteAddress)
        /*console.log(request.raw)
        console.log(request.server)
        console.log(request.id)*/
        console.log(request.connection.hostname)
        console.log(request.ip)
        console.log(request.ips)
        console.log(request.protocol)
        console.log(request.url)
        request.log.info('some info')
    })

    done()
}