require('./user');
const Users = require('mongoose').model('User');

module.exports = async (ctx, next) => {
	const user = await Users.findOne({ chatId: ctx.message.chat.id });

	// User hasn't registered yet
	if (!user) {
		ctx.reply('Please register to continue');
		ctx.reply('Type /register to confirm your registration and this implies that you have agreed to our T&C');
		return;
	}

	// User do not have an file uploaded and hasn't typed /command
	if (!user.fileUrl && !ctx.session?.hasInitiatedFileUpload) {
		ctx.reply('You haven\'t uploaded any file');
		ctx.reply('Type /file to upload or update the file that was provided');
		return;
	}

	// User typed /file but didn't upload an document
	if (ctx.session?.hasInitiatedFileUpload && typeof ctx.update?.message?.document == "undefined") {
		ctx.reply('Please upload an valid document');
		return;
	}

	// User tried to upload a document without typing /file first
	if (!ctx.session?.hasInitiatedFileUpload && typeof ctx.update?.message?.document != "undefined") {
		ctx.reply('To change your uploaded document, type /file again');
		return;
	}

	// User send a random message
	if (typeof ctx.update?.message?.document == "undefined") return next();

	// File upload
	const { file_id } = ctx.update.message.document;
	user.fileUrl = (await ctx.telegram.getFileLink(file_id)).href;
	user.lastMessageTime = new Date();
	user.lastConfirmTime = new Date();
	user.hasConfirmed = true;
	await user.save();
	ctx.session.hasInitiatedFileUpload = false;
	ctx.reply('Awesome!');
	ctx.reply('Now you can use /interval to set message interval and /deadline to set confirm deadline');
}