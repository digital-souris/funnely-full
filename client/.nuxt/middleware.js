const middleware = {}

middleware['noAuth'] = require('..\\middleware\\noAuth.js')
middleware['noAuth'] = middleware['noAuth'].default || middleware['noAuth']

export default middleware
