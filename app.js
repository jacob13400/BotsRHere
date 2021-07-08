const { Telegraf } = require('telegraf')
require('dotenv').config();
const schedule = require('node-schedule');


const bot = new Telegraf(process.env.BOT)
var chatID = 0;
bot.start((ctx) => {
    ctx.reply('Welcome we will now register this chat window for further communications!');
    chatID = ctx.message.chat.id;
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

const job = schedule.scheduleJob('42 * * * * *', function(){
    console.log('The answer to life, the universe, and everything!');
    bot.telegram.sendMessage(chatID, 'Send me a sticker');
});

bot.launch()