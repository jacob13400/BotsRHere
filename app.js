const { Telegraf } = require('telegraf')
require('dotenv').config();
const schedule = require('node-schedule');


const bot = new Telegraf(process.env.BOT)
var chatID = 0;
bot.start((ctx) => {
    ctx.reply('Welcome we will now register this chat window for further communications!');
    chatID = ctx.message.chat.id;
})

bot.help((ctx) => {
    ctx.reply('hello, please type /start to register yourself with our services!');
})

const job = schedule.scheduleJob('42 * * * * *', function(){
    console.log('The answer to life, the universe, and everything!');
    bot.telegram.sendMessage(chatID, 'Send me a sticker');
});

bot.launch()