require('./user');
const Users = require('mongoose').model('User');

const changeTime = async (ctx, type, time) => {
	const user = await Users.findOne({ chatId: ctx.chat.id });

	if (!user) {
		ctx.reply('Please register to continue');
		ctx.reply('Type /register to confirm your registration and this implies that you have agreed to our T&C');
		return;
	}

	user.lastMessageTime = new Date();
	user.lastConfirmTime = new Date();

	if(type == 0) user.deadline = time;
	else user.duration = time;
	// else 
	
	user.save();
	ctx.reply('Succesfully changed interval');
}

const userConfirmed = async (ctx) => {
	const user = await Users.findOne({ chatId: ctx.chat.id });

	if (!user) {
		ctx.reply('Please register to continue');
		ctx.reply('Type /register to confirm your registration and this implies that you have agreed to our T&C');
		return;
	}

	user.hasConfirmed = true;
	user.lastConfirmTime = new Date();
	user.save();

	const nextMessageTime = new Date(user.lastMessageTime.getTime() + user.duration*60000);
	ctx.reply('Success!!');
	ctx.reply('Next message on ' + nextMessageTime);
}

module.exports = { changeTime, userConfirmed };