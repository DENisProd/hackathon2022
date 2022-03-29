const userController = require('../controller/users');
const rolesController = require('../controller/roles')
const storageController = require('../controller/storage')
const fileController = require('../controller/files')
const folderController = require('../controller/folder')
const publicRoutes = require('./PublicRoutes')


module.exports = function (fastify, options, done) {
    fastify.decorate("authenticate", async (request, reply) => {
        try {
            await request.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    })
        .after(() => {

            fastify.route({
                method: 'GET',
                url: '/api/user/:userId',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return userController.getProfile(request, reply)
                }
            })

            fastify.route({
                method: 'GET',
                url: '/api/user/check',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return userController.checkToken(request, reply, fastify.jwt)
                }
            })

            fastify.route({
                method: 'POST',
                url: '/api/user/changeimg',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return userController.changeImage(request, reply, fastify.jwt)
                }
            })

            fastify.route({
                method: 'POST',
                url: '/api/user/addmaster',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return userController.addMasterPassword(request, reply, fastify.jwt)
                }
            })

            fastify.route({
                method: 'GET',
                url: '/api/roles',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return rolesController.getAllRoles(request, reply, fastify.jwt)
                }
            })

            fastify.route({
                method: 'POST',
                url: '/api/roles/create',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return rolesController.addRole(request, reply, fastify.jwt)
                }
            })

            fastify.route({
                method: 'GET',
                url: '/api/storage/all',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return storageController.getAllStorages(request, reply, fastify.jwt)
                }
            })
            fastify.route({
                method: 'GET',
                url: '/api/storages/:userId',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return storageController.getStorages(request, reply, fastify.jwt)
                }
            })

            fastify.route({
                method: 'GET',
                url: '/api/folders/:storageId',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return folderController.getFolders(request, reply, fastify.jwt)
                }
            })

            fastify.route({
                method: 'GET',
                url: '/api/user/all',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return userController.getAllUsers(request, reply, fastify.jwt)
                }
            })

            fastify.route({
                method: 'POST',
                url: '/api/storage/create',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return storageController.addStorage(request, reply, fastify.jwt)
                }
            })

            fastify.route({
                method: 'POST',
                url: '/api/file/create/:storageId',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return fileController.createFile(request, reply, fastify.jwt)
                }
            })

            fastify.route({
                method: 'POST',
                url: '/api/folder/create/:storageId',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return folderController.createFolder(request, reply, fastify.jwt)
                }
            })

            fastify.route({
                method: 'GET',
                url: '/api/storage/remove/:storageId',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return storageController.deleteStorage(request, reply, fastify.jwt)
                }
            })

            fastify.route({
                method: 'POST',
                url: '/api/storage/adduser/:storageId',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return storageController.addUserToStorage(request, reply, fastify.jwt)
                }
            })

            fastify.route({
                method: 'GET',
                url: '/api/file/remove/:fileId',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return fileController.deleteFile(request, reply, fastify.jwt)
                }
            })

            fastify.route({
                method: 'GET',
                url: '/api/folder/remove/:folderId',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return folderController.deleteFolder(request, reply, fastify.jwt)
                }
            })

            fastify.route({
                method: 'POST',
                url: '/api/file/update/:fileId',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return fileController.updateValueInFile(request, reply, fastify.jwt)
                }
            })

            

            fastify.route({
                method: 'GET',
                url: '/api/role/remove/:roleId',
                preHandler: [fastify.authenticate],
                handler: (request, reply) => {
                    return rolesController.deleteRole(request, reply, fastify.jwt)
                }
            })
            
        })
    publicRoutes(fastify, options, done)


    done()
}