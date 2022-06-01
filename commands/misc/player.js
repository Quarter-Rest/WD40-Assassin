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
                message.reply("That is not a valid user.");
                return; // Do not proceed, there is no user.
            }

            global.con.query('SELECT * FROM `players`',
                function(err, results, fields) {
                    let players = results;

                    const isFound = players.some(element => 
                    {
                        if (element.id === user.id) 
                        {
                            return true;
                        }
                        
                        return false;
                    });

                    if(isFound === false)
                    {
                        global.con.query(`INSERT INTO players (id, targetid, alive, points) values (${user.id}, '0', true, 0)`, (err, row) => {
                            // Return if there is an error
                            if (err) {
                                message.channel.send("Failed");
                                return console.log(err);
                            }

                            message.channel.send(`Added ${user.username}.`);
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
                    if (element.id === user.id) {
                        return true;
                    }
                    
                    return false;
                });

                if(isFound)
                {
                    global.con.query(`DELETE FROM players WHERE id = ${user.id}`, (err, row) => {
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

                // We are using fetch because we wanna make sure all users are valid
                const promises = [];
                players.forEach(playerData => {
                    let getPlayer = message.client.users.fetch(playerData.id);
                    getPlayer.then(function(player) {
                        let alive = false;
                        if(playerData.alive == 1) alive = true;
                        embed.addField(`${player.username}`, `**Points:** ${playerData.points}\n**Alive:** ${alive}`, false)
                    });
                    promises.push(getPlayer);
                });
                
                // Once all the users are got, we can send the message.
                Promise.all(promises).then(() => {
                    message.channel.send({embeds: [embed]});
                });
            });
        }
        
	},
};
