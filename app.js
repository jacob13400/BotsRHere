const { Telegraf, session, Scenes } = require('telegraf');
const upload = require('./functions/upload');

require('dotenv').config();
require('./database/dbconfig')();
const { changeTime, userConfirmed } = require('./functions/utils');

require('./database/user');
const Users = require('mongoose').model('User');

const bot = new Telegraf(process.env.BOT);

require('./functions/scheduler')(bot);


const contactDataWizard = new Scenes.WizardScene(
    'registration', // first argument is Scene_ID, same as for BaseScene
    (ctx) => {
        ctx.reply("What should we call you? This name will be made public along with the file when the dead man's switch is activated. Choose wisely");
        ctx.wizard.state.contactData = {};
        return ctx.wizard.next();
    },
    async (ctx) => {
        const chatId = ctx.message.chat.id;
        const userName = ctx.message.text;
        try {
            console.log(userName);
            const user = await Users.create({ chatId, userName});
            if (!user) throw new Error();
        } catch (e) {
            ctx.reply('Please try again');
            console.error(e);
            return;
        }
        ctx.reply(`We'll be calling you ${ctx.message.text}`);
        ctx.reply('You are succesfully registered!');
        return ctx.scene.leave();
    },

  );


const stage = new Scenes.Stage([contactDataWizard]);
bot.use(session());
bot.use(stage.middleware());

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
    ctx.reply('Type /deadline to set your deadline');
    ctx.reply('Type /interval to select your interval');
})

bot.command('terms', (ctx) => {
    // List all the terms and conditions
    ctx.reply('We own your first born and would like to use them as our waifu model.');
})

bot.command('register', async (ctx) => {
    // Just add an another index that states that they have agreed to terms and conditions
    // For legal purposes
    ctx.scene.enter('registration');
})

bot.command('file', (ctx) => {
    ctx.session = { hasInitiatedFileUpload: true };
    ctx.reply('If you have seen the welcome message, your chat has been registered with our services.');
    ctx.reply('You can upload your file now');
})

bot.command('/deadline', ctx => {
    const messageText = 'Select your interval';
    bot.telegram.sendMessage(ctx.chat.id, messageText, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "1 min",
                        callback_data: '1min_dl'
                    },
                    {
                        text: "2 min",
                        callback_data: '2min_dl'
                    },
                    {
                        text: "5 min",
                        callback_data: '5min_dl'
                    }
                ],

            ]
        }
    })
});

bot.command('/interval', ctx => {
    const messageText = 'Select your interval';
    bot.telegram.sendMessage(ctx.chat.id, messageText, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "5 min",
                        callback_data: '5min_in'
                    },
                    {
                        text: "10 min",
                        callback_data: '10min_in'
                    },
                    {
                        text: "15 min",
                        callback_data: '15min_in'
                    }
                ],

            ]
        }
    })
});

bot.action('1min_dl', async ctx => changeTime(ctx, 0, 1));
bot.action('2min_dl', async ctx => changeTime(ctx, 0, 2));
bot.action('5min_dl', async ctx => changeTime(ctx, 0, 5));
bot.action('5min_in', async ctx => changeTime(ctx, 1, 5));
bot.action('10min_in', async ctx => changeTime(ctx, 1, 10));
bot.action('15min_in', async ctx => changeTime(ctx, 1, 15));

bot.on('sticker', userConfirmed);

bot.use(upload);

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
