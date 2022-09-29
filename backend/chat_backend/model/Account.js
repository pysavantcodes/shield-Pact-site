
const mongoose = require('mongoose');

const { Schema } = mongoose;

const accountSchema = new Schema({
	userId: { type: String, required:true, index: true },
	userName:  {type:String, required:true},
	userKey: {type: String, required:true}, // String is shorthand for {type: String}
	lastRead: {type: Date, default: Date.now},
	unReadSize: {type:Number, default:0},
	disabled: Boolean,
	friends: Array
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;