const { Telegraf } = require('telegraf')
require('dotenv').config();

const bot = new Telegraf(process.env.BOT)
var chatID = 0;
bot.start((ctx) => {
    ctx.reply('Welcome we will now register this chat window for further communications!');
    ctx.reply('If this is your first time using our services, please to enter /help to get more details.');
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
    ctx.reply('If you have seen the welcome message, your chat has been registered with our services.');
    ctx.reply('Type /register to confirm your registration and this implies that you have agreed to our T&C');
    ctx.reply('Type /terms to list out our terms and conditions');
    ctx.reply('Type /file to upload or update the file that was provided');
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
