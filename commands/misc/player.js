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

            global.con.query('SELECT * FROM `players`',
                function(err, results, fields) {
                    let players = results;

                    const isFound = players.some(element => {
                        if (element.ID === user.id) {
                            return true;
                        }
                        
                        return false;
                    });

                    if(isFound === false)
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
            );
        }

        if(commandType == "remove")
        {
            const user = message.mentions.users.first();
            if (user === undefined) 
            {
                message.channel.send("That is not a valid user.");
                return; // Do not proceed, there is no user.
            }

            global.con.query('SELECT * FROM `players`', function(err, results, fields) {
                let players = results;

                const isFound = players.some(element => {
                    if (element.ID === user.id) {
                        return true;
                    }
                    
                    return false;
                });

                if(isFound)
                {
                    global.con.query(`DELETE FROM players WHERE ID = ${user.id}`, (err, row) => {
                        // Return if there is an error
                        if (err) {
                            message.channel.send("Failed");
                            return console.log(err);
                        }
                        else message.channel.send(`Removed ${user.username}.`);
                    });
                }
                else
                {
                    message.channel.send("That player is not in the game.");
                }
            });
        }

        if(commandType == "get")
        {
            global.con.query('SELECT * FROM `players`', function(err, results, fields) {
                let players = results;

                let embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Players');


                players.forEach(playerData => {
                    let player = message.client.users.fetch(playerData.ID);
                    if(player != undefined) embed.addField("Player", player.username, true)
                });

                message.channel.send({embeds: [embed]});
            });
        }
        
	},
};
