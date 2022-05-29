/**
 * @file Ready Event File.
 * @author Naman Vrati
 * @since 1.0.0
 */
const mongo = require('../mongo.js')
module.exports = {
	name: "ready",
	once: true,

	/**
	 * @description Executes the block of code when client is ready (bot initialization)
	 * @param {import("discord.js").Client} client Main Application Client
	 */
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

        await mongo()
	},
};
