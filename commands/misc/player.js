const { MessageEmbed } = require('discord.js');
module.exports = {
	name: "player",
    aliases: "players",
    description: "Player commands",

	execute(message, args) 
    {
        if (global.adminIDs.includes(message.author.id) == false)
        {
            message.channel.send("You can't do this.")
            return;
        }

        const commandType = args[0].toLowerCase();

        if(commandType == "add")
        {
            const user = message.mentions.users.first();
            if (user === undefined) 
            {
                message.channel.send("That is not a valid user.");
                return; // Do not proceed, there is no user.
            }

            let players = {};
            global.con.query('SELECT * FROM `players`',
                function(err, results, fields) {
                    players = results;
                }
            );

            if(players === undefined)
            {
                players = {};
            }

            console.log(players);

            if(!(user.id in players))
            {
                global.con.query(`INSERT INTO players (ID, TARGET, ALIVE) values (${user.id}, '0', true)`, (err, row) => {
                    // Return if there is an error
                    if (err) {
                        message.channel.send("Failed");
                        return console.log(err);
                    }
                    else message.channel.send(`Added ${user.username}.`);
                });
            }
            else
            {
                message.channel.send("That player is already in the game.");
            }
        }

        if(commandType == "remove")
        {
            const user = message.mentions.users.first();
            if (user === undefined) 
            {
                message.channel.send("That is not a valid user.");
                return; // Do not proceed, there is no user.
            }

            let players = db.get('players');
            if(players === undefined)
            {
                message.channel.send("No players.");
                return;
            }

            if(user.id in players)
            {
                delete players[user.id];

                db.set('players', JSON.stringify(players));
                message.channel.send("Removed.");
            }
            else
            {
                message.channel.send("That player is not in the game.");
            }
        }

        if(commandType == "get")
        {
            let players = db.get('players');
            if(players === undefined)
            {
                players = {};
            }

            let embed = new MessageEmbed()
            .setColor('#0099ff')
			.setTitle('Players');

            for (const [id, data] of Object.entries(players)) 
            {
                let player = message.client.users.cache.get(id);
                if(player === undefined) continue;

                embed.addField("Player", message.client.users.cache.get(id).username, true)
            }

            message.channel.send({embeds: [embed]});
        }
        
	},
};
