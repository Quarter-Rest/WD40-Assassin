module.exports = {
	name: "timertest",

	/** You need to uncomment below properties if you need them. */
	//description: 'Ping!',
	//usage: 'put usage here',
	//permissions: 'SEND_MESSAGES',
	//guildOnly: true,

	execute(message, args) {
		message.channel.send({ content: "Timer Start." });
        setTimeout(() => {
            message.channel.send({ content: "Timer End after 1 second." });
        }, 1000)
	},
};
