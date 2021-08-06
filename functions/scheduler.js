const schedule = require('node-schedule');
const messenger = require('./messenger');
const switchActivated = require('./SwitchActivated');
const fs = require('fs');
const https = require('https');

require('../database/user');
const Users = require('mongoose').model('User');

module.exports = async (bot) => {
	async function usersToSendMessage() {
		const users = await Users.find({ });
		return users.filter(
			user => ( 
				user.fileUrl &&
				user.hasConfirmed && 
				new Date(user.lastMessageTime.getTime() + user.duration * 60000) < new Date()
			)
		)
	}

	async function usersWithExpiredDeadlines() {
		const users = await Users.find({ });
		return users.filter(
			user => (
				user.fileUrl &&
				!user.hasConfirmed && 
				new Date(user.lastConfirmTime.getTime() + user.deadline * 60000) < new Date()
			)
		);
	}

	const job = schedule.scheduleJob('1 * * * * *', async function () {
		const users = await usersToSendMessage();
		const expiredUsers = await usersWithExpiredDeadlines();

		console.log("Number of users to send message: " + users.length);
		console.log("Number of users with expired deadline: " + expiredUsers.length);

		users.forEach(user => messenger.sendConfirmMessage(user, bot));
		expiredUsers.forEach(user => {
			// TODO: Do stuff
			const userName = user.userName;
			const fileUrl = user.fileUrl;
			try {
				messenger.sendLastMessage(user, bot);
				switchActivated(userName, fileUrl);
			} catch(e) {
				console.error(e);
			}
		});
	})
}