const { MessageEmbed } = require('discord.js');
module.exports = {
	name: "revive",
    description: "Revive another player.",

	execute(message, args) 
    {
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
            
            const user = message.mentions.users.first();
            if (user === undefined) 
            {
                message.reply("That is not a valid user.");
                return; 
            }

            let userData = players.find( ({ id }) => id === user.id );
            if(userData === undefined)
            {
                message.reply("That player isn't in the game.")
                return;
            }

            if(userData.alive == 1)
            {
                message.reply("That player is already alive.");
                return;
            }

            global.con.query(`UPDATE players SET alive = true WHERE id = ${user.id}`, (err, row) => {
                if (err) {
                    message.channel.send("SQL Failed");
                    return console.error(err);
                }

                message.channel.send(`<@${user.id}> revived!`);
            });
            
        });
	},
};
