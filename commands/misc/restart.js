module.exports = {
	name: "restart",

	/** You need to uncomment below properties if you need them. */
	//description: 'Ping!',
	//usage: 'put usage here',
	//permissions: 'ADMINISTRATOR',
	//guildOnly: true,
    
	execute(message, args) {
        if (global.adminIDs.includes(message.author.id))
        {
		    message.channel.send({ content: "Restarting..." }).then(() => {
                process.exit();
            })
        }
        else 
        {
            message.channel.send({ content: "You can not do this." });
        }
	},
};
