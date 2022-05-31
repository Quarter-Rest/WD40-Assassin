const { MessageEmbed } = require('discord.js');
module.exports = {
	name: "kill",
    description: "Kill another player.",

	execute(message, args) 
    {
        global.con.query('SELECT * FROM `players`', function(err, results, fields) {
            if(err)
            {
                message.channel.send("SQL Failed")
                console.error(err);
            }

            let players = results;
            let authorData = players.find( ({ id }) => id === message.author.id );
            if(authorData === undefined)
            {
                message.reply("You aren't in the game.");
                return;
            }

            if(authorData.alive == 0)
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
                            KillPlayer(message, user, authorData);
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
                    });
                })
            });

        });
	},
};

function KillPlayer(message, killedPlayer, authorData)
{
    message.channel.send(`<@&${global.roleID}>. ${killedPlayer.username} was killed by ${message.author.username}!`);

    if(authorData.targetid = killedPlayer.id)
    {
        // Kill player
        global.con.query(`UPDATE players SET alive = false WHERE id = ${killedPlayer.id}`, (err, row) => {
            if (err) {
                message.channel.send("SQL Failed");
                return console.error(err);
            }
        });

        let points = authorData.points + 1;

        // Give point to assassin
        global.con.query(`UPDATE players SET points = ${points}, targetid = '0', WHERE id = ${message.author.id}`, (err, row) => {
            if (err) {
                message.channel.send("SQL Failed");
                return console.error(err);
            }
        });
    }
}
