const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	// Telegram unique chat id
	chatId: {
		type: String,
		required: [true, 'Can\'t be blank'],
		unique: true
	},

	// URL of uploaded document
	fileUrl: String,
	
	// Last time user replied to message
	lastConfirmTime: Date,

	// Has confirmed to last message
	hasConfirmed: Boolean,
	
	// Interval duration in days for scheduling messages
	duration: {
		type: Number,
		default: 10
	}
});

mongoose.model('User', UserSchema);