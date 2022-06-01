module.exports = {
	name: "timertest",

	/** You need to uncomment below properties if you need them. */
	//description: 'Ping!',
	//usage: 'put usage here',
	//permissions: 'SEND_MESSAGES',
	//guildOnly: true,

	execute(message, args) {
		message.channel.send({ content: "Timer Start." });
        let curTime = Date.now();
        let timeToEnd = curTime + 10000;
        setTimeout(() => {
            message.channel.send({ content: "Timer End after 1 second." });
        }, curTime - timeToEnd);
	},
};
