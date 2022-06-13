const { MessageEmbed } = require('discord.js');
module.exports = {
	name: "player",
    aliases: "players",
    description: "Player commands. Get | Add | Remove",

	execute(message, args) 
    {

        let commandType = "";

        if(args[0] === undefined)
        {
            commandType = "get"
        }
        else
        {
            commandType = args[0].toLowerCase();
        }

        if(commandType == "add")
        {
            if (global.adminIDs.includes(message.author.id) == false)
            {
                message.channel.send("You can't do this.")
                return;
            }
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
                        global.con.query(`INSERT INTO players (id, targetid, alive, points, timeToRevive, timeToGetNewTarget) values (${user.id}, '0', true, 0, 0, 0)`, (err, row) => {
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
            if (global.adminIDs.includes(message.author.id) == false)
            {
                message.channel.send("You can't do this.")
                return;
            }
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
            module.exports.getPlayers(message);
        }
        
	},
    getPlayers(message)
    {
        global.con.query('SELECT * FROM `players`', function(err, results, fields) {
            let players = results;

            global.con.query('SELECT * FROM `game`', function(err1, results1, fields1) {
                if(err1)
                {
                    message.channel.send("SQL failed.");
                    return;
                }

                let game = results1[0];
                // bool conversion
                if(game.running === 1) game.running = true
                else game.running = false

                let embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Game is not running.');

                if(game.running) embed.setTitle('Game is currently running.')

                // We are using fetch because we wanna make sure all users are valid
                const promises = [];
                players.forEach(playerData => 
                {
                    let getPlayer = message.client.users.fetch(playerData.id);
                    getPlayer.then(function(player) 
                    {
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
        });
    }
};
