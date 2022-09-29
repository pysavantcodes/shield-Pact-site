const Account = require('./Account');

const Message = require('./Message');

const mongoose = require('mongoose');

const connectDB = (uri, /*options ,*/)=> mongoose.connect(uri/*,options*/);

/*options = {
	auth:{
		user:,
		pass:,
	},
	dbName:,
}

*/

module.exports = {connectDB, Account, Message};
