const { Telegraf, session } = require('telegraf');

require('dotenv').config();
require('./dbconfig')();
require('./user');

const Users = require('mongoose').model('User');

const bot = new Telegraf(process.env.BOT)
bot.use(session());

var chatID = 0;
bot.start((ctx) => {
    ctx.reply('Welcome we will now register this chat window for further communications!');
    ctx.reply('If this is your first time using our services, please to enter /help to get more details.');
    chatID = ctx.message.chat.id;
})

bot.help((ctx) => {
    ctx.reply('If you have seen the welcome message, your chat has been registered with our services.');
    ctx.reply('Type /register to confirm your registration and this implies that you have agreed to our T&C');
    ctx.reply('Type /terms to list out our terms and conditions');
    ctx.reply('Type /file to upload or update the file that was provided');
})

bot.command('terms', (ctx) => {
    // List all the terms and conditions
    ctx.reply('We own your first born and would like to use them as our waifu model.');
})

bot.command('register', async (ctx) => {
    // Just add an another index that states that they have agreed to terms and conditions
    // For legal purposes
    const chatId = ctx.message.chat.id;

    try {
        const user = await Users.create({ chatId });
        if(! user) throw new Error();
    } catch(e) {
        ctx.reply('Please try again');
        return;
    }

    ctx.reply('If you are seeing this meessage then you have agreed to all our terms and conditions.');
    ctx.reply('You are succesfully registered');
})

bot.command('file', (ctx) => {
    ctx.session = { hasInitiatedFileUpload: true };
    ctx.reply('If you have seen the welcome message, your chat has been registered with our services.');
})

bot.use(async (ctx, next) => {
    const user = await Users.findOne({ chatId: ctx.message.chat.id });

    if(! user) {
        ctx.reply('Please register to continue');
        ctx.reply('Type /register to confirm your registration and this implies that you have agreed to our T&C');
        return;
    }

    if(!user.fileUrl && !ctx.session?.hasInitiatedFileUpload) {
        ctx.reply('You haven\'t uploaded any file');
        ctx.reply('Type /file to upload or update the file that was provided');
        return;
    }

    if(ctx.session?.hasInitiatedFileUpload && typeof ctx.update?.message?.document == "undefined") {
        ctx.reply('Please upload an valid document');
        return;
    }

    if(!ctx.session?.hasInitiatedFileUpload && typeof ctx.update?.message?.document != "undefined") {
        ctx.reply('To change your uploaded document, type /file again');
        return;
    }

    const { file_id } = ctx.update.message.document;
    user.fileUrl = (await ctx.telegram.getFileLink(file_id)).href;
    await user.save();
    ctx.session.hasInitiatedFileUpload = false;
    ctx.reply('Succesfully updated document');
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
