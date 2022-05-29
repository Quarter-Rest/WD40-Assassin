module.exports = {
	name: "restart",

	/** You need to uncomment below properties if you need them. */
	//description: 'Ping!',
	//usage: 'put usage here',
	//permissions: 'ADMINISTRATOR',
	//guildOnly: true,

	execute(message, args) {
        if (message.author.id === owner)
        {
		    message.channel.send({ content: "Restart test" });
        }
        else 
        {
            message.channel.send({ content: "You can not do this." });
        }
	},
};
