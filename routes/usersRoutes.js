const userController = require('../controller/users');

const routes = [
    {
        method: 'POST',
        url: '/api/user/register',
        handler: userController.register
    },
]
module.exports = routes