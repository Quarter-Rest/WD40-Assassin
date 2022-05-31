const { MessageEmbed } = require('discord.js');
module.exports = {
	name: "kill",
    description: "Kill another player.",

	execute(message, args) 
    {
        global.con.query('SELECT * FROM `players`', function(err, results, fields) {
            let players = results;
            if(players[message.author.id] === undefined)
            {
                message.reply("You aren't in the game.");
            }
        });

        const commandType = args[0].toLowerCase();
	},
};
