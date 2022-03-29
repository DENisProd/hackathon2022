const blogController = require('../controller/blog');

const getBlogValidation = {
        params: {
            id: { type: 'string' } // Try changing to object to see error
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    title: { type: 'string' }
                }
            }
        }
}

const addBlogValidation = {
    body: {
        type: 'object',
        required: [
            'title'
        ],
        properties: {
            title: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                title: { type: 'string' }
            }
        }
    }
}

const routes = [{
        method: 'GET',
        url: '/api/blogs',
        handler: blogController.getAllBlogs
    },
    {
        method: 'GET',
        url: '/api/blogs/:id',
        schema: getBlogValidation,
        handler: blogController.getBlog
    },
    {
        method: 'POST',
        url: '/api/blogs',
        schema: addBlogValidation,
        handler: blogController.addBlog
    },
    {
        method: 'PUT',
        url: '/api/blogs/:id',
        handler: blogController.updateBlog
    },
    {
        method: 'DELETE',
        url: '/api/blogs/:id',
        handler: blogController.deleteBlog
    }
]
module.exports = routes