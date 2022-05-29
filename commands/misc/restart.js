module.exports = {
	name: "restart",

	/** You need to uncomment below properties if you need them. */
	//description: 'Ping!',
	//usage: 'put usage here',
	permissions: 'ADMINISTRATOR',
	//guildOnly: true,

	execute(message, args) {
		message.channel.send({ content: "Restart test" });
	},
};
