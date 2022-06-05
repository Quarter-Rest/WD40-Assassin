const kill = require("./kill");

module.exports = {
	name: "forcekill",
    description: "Admin force kill a player. Arg 1 kills Arg 2",

	execute(message, args) {
		if (global.adminIDs.includes(message.author.id) == false)
        {
            message.channel.send("You can't do this.")
            return;
        }

        global.con.query('SELECT * FROM `players`', function(err, results, fields) {
            if(err)
            {
                message.channel.send("SQL Failed")
                console.error(err);
            }

            let players = results;
            const author = message.mentions.users.first();
            if (author === undefined) 
            {
                message.reply("First arg is not a valid user.");
                return; 
            }

            const user = message.mentions.users.last();
            if (user === undefined) 
            {
                message.reply("Second arg is not a valid user.");
                return; 
            }

            let userData = players.find( ({ id }) => id === user.id );
            if(userData === undefined)
            {
                message.reply(`${user.username} isn't in the game.`)
                return;
            }

            if(userData.alive == 0)
            {
                message.reply(`${user.username} is already dead.`);
                return;
            }

            let authorData = players.find( ({ id }) => id === author.id );
            if(authorData === undefined)
            {
                message.reply(`${author.username} isn't in the game.`)
                return;
            }

            if(userData.id === authorData.id)
            {
                message.reply("Sorry, you cannot kill yourself.")
                return;
            }

            const killCommand = message.client.commands.get("kill");
            
            global.con.query('SELECT * FROM `game`', function(err1, results1, fields1) {
                if(err1)
                {
                    message.channel.send("SQL failed.");
                    console.error(err1);
                    return;
                }

                let game = results1[0];
                if(game.running === 0)
                {
                    message.reply("There is no game running.")
                    return;
                }

                // https://stackoverflow.com/questions/45856446/how-do-i-wait-for-a-reply-in-discord-js
                const filter = (m) => m.author.id === message.author.id;
                message.reply("Are you sure you want to kill that player? This cannot be undone and everyone playing will be notified that you have done this.")
                .then(() => 
                {
                    message.channel.awaitMessages({filter: filter, max: 1, time: 30000, errors: ['time']})
                    .then(message => 
                    {
                        message = message.first()

                        if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') 
                        {
                            killCommand.KillPlayer(message.client, message, user, authorData, userData, game);
                        } 
                        else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') 
                        {
                            message.channel.send(`Watch your fire next time.`)
                        } 
                        else 
                        {
                            message.channel.send(`Guess the bullet missed due to an invalid reply.`)
                        }
                    })
                    .catch(collected => 
                    {
                        message.channel.send('Guess the bullet missed due to an error.');
                        console.error(collected)
                    });
                })
            });

        });
	},
};
