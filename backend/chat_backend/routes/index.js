const accountRoute = require('./account');
const messageRoute = require('./message');
const registerErrorHandler = require('./error');
const registerRoute = (app, path='/')=>{
	app.use(path, accountRoute);
	app.use(path, messageRoute);
	registerErrorHandler(app);
}

module.exports = registerRoute;