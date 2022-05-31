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
                return;
            }

            if(players[message.author.id].alive == 0)
            {
                message.reply("You aren't alive.");
                return;
            }
            
            const user = message.mentions.users.first();
            if (user === undefined) 
            {
                message.reply("That is not a valid user.");
                return; 
            }

            // https://stackoverflow.com/questions/45856446/how-do-i-wait-for-a-reply-in-discord-js
            let filter = m => m.author.id === message.author.id
            message.reply("Are you sure you want to kill that player? This cannot be undone and everyone playing will be notified that you have done this.")
            .then(() => {
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                })
                .then(message => {
                    message = message.first()

                    if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                        message.channel.send(`Player killed.`)
                    } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                        message.channel.send(`Watch your fire next time.`)
                    } else {
                        message.channel.send(`Guess the bullet missed.`)
                    }
                })
                .catch(collected => {
                    message.channel.send('Guess the bullet missed.');
                });
            })


        });
	},
};
