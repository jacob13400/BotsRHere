module.exports = function (chatID, bot) {

    // To be added to DB separetly or find a better method

    // chatID has the unique id to which the message is to be sent

    console.log('The answer to life, the universe, and everything!');
    bot.telegram.sendMessage(chatID, 'Send me a sticker if you alive');
}