var nconf = require('nconf');

module.exports = {
	name: "game",
    description: "Game commands",

	execute(message, args) 
    {
        if (global.adminIDs.includes(message.author.id) == false)
        {
            message.channel.send("You can't do this.")
            return;
        }

        const commandType = args[0].toLowerCase();
        let save = false;

        nconf.use('file', { file: './data.json' });
        nconf.load();
        let players = nconf.get('players');
        let game = nconf.get('game');
        if(game === undefined)
        {
            game = 
            {
                started: false
            }
        }

        if(commandType == "start")
        {
            if(game.started === true)
            {
                message.channel.send("A game already exists!")
            }
            else
            {
                message.channel.send(`<@&${global.roleID}>. Starting game. Sending all current players a target in their DMs.`)
                game.started = true;

                players.forEach(id => {
                    let player = message.client.users.cache.get(id);
                    player.send("Test").then(() => {
                        if (message.channel.type === "dm") return;
                    })
                    .catch((error) => {
                        // On failing, throw error.
                        console.error(
                            `Could not send DM to ${player.tag}.\n`,
                            error
                        );
    
                        message.channel.send(`Could not send DM to ${player.tag}.\n`);
                    });
                }); 

                nconf.set('game', game);
                save = true;
            }
        }

        if(commandType == "end")
        {
            if(game.started === false)
            {
                message.channel.send("A game doesn't exist!")
            }
            else
            {
                message.channel.send("Ending game.")
                game.started = false;
                nconf.set('game', game);
                save = true;
            }
        }

        if(save)
        {
            nconf.save(function (err) 
            {
                if (err) {
                    message.channel.send(err.message);
                    return;
                }
            });
        }
	},
};
