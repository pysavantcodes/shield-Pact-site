const mongoose  = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema({
	from: { type: String, required:true, index: true },
	to: {type: String, required:true},
	body: {type: String, required:true},
	timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

