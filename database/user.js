const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	// Telegram unique chat id
	chatId: {
		type: String,
		required: [true, 'Can\'t be blank'],
		unique: true
	},

	userName: {
		type: String,
		required: [true, 'Can\'t be blank']
	},

	// URL of uploaded document
	fileUrl: String,
	
	// Last time user replied to message
	lastConfirmTime: Date,

	// Last time confirmation message was send to user
	lastMessageTime: Date,

	// Has confirmed to last message
	hasConfirmed: Boolean,
	
	// Interval duration in days for scheduling messages
	duration: {
		type: Number,
		default: 5
	},

	// Deadline time
	deadline: {
		type: Number,
		default: 1
	}
}); 

mongoose.model('User', UserSchema);