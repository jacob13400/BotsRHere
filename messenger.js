require('./user');
const Users = require('mongoose').model('User');

async function sendConfirmMessage(user, bot) {
    user.hasConfirmed = false;
    user.lastMessageTime = new Date();
    await user.save();
    bot.telegram.sendMessage(user.chatId, 'Send me a sticker if you alive');
}

async function sendLastMessage(user, bot) {
    bot.telegram.sendMessage(user.chatId, 'Sorry you failed to respond on time');
    bot.telegram.sendMessage(user.chatId, 'Your file is now public');
    bot.telegram.sendMessage(user.chatId, 'Your records will be deleted from our server');
    bot.telegram.sendMessage(user.chatId, 'Good bye');
    await user.remove();
}

module.exports = { sendConfirmMessage, sendLastMessage };