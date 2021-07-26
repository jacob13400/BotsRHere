const { Telegraf } = require('telegraf')
require('dotenv').config();

const bot = new Telegraf(process.env.BOT)
var chatID = 0;
bot.start((ctx) => {
    ctx.reply('Welcome we will now register this chat window for further communications!');
    chatID = ctx.message.chat.id;

    // Store the new user/prepare to update user with unique id as chatID
})

bot.use(async (ctx, next) => {
    if(typeof ctx.update?.message?.document == "undefined") {
        // TODO: Check if user already has uploaded a file
        next();
        return;
    }

    const { file_id } = ctx.update.message.document;
    const fileUrl = await ctx.telegram.getFileLink(file_id);
    console.log(fileUrl.href); // TODO: Add this url to the database
})

bot.help((ctx) => {
    ctx.reply('hello, please type /start to register yourself with our services!');
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
