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

        nconf.use('file', { file: './data.json' });
        nconf.load();
        let players = nconf.get('players');
        let game = nconf.get('game');
        if(game === undefined)
        {
            game = 
            {
                started: false,
                playersAlive: []
            }
        }

        if(commandType == "start")
        {
            StartGame(message, game, players);
        }

        if(commandType == "end")
        {
            EndGame(message, game, players);
        }

        if(commandType == "restart")
        {
            EndGame(message, game, players);
            StartGame(message, game, players);
        }

        nconf.save(function (err) 
        {
            if (err) {
                message.channel.send(err.message);
                return;
            }
        });
        
	},
};

function StartGame(message, game, players)
{
    if(game.started === true)
    {
        message.channel.send("A game already exists!")
    }
    else
    {
        message.channel.send(`<@&${global.roleID}>. Starting game. Sending all current players a target in their DMs.`)
        game.started = true;
        game.playersAlive = players;

        for (const [id, data] of Object.entries(players)) 
        {
            // Set player alive
            data.alive = true;

            let player = message.client.users.cache.get(id);
            if(player === undefined) continue;
            let targetName = "error send griffon a dm";

            var randomPlayer = function (players) {
                var keys = Object.keys(players);
                return players[keys[ keys.length * Math.random() << 0]];
            };

            console.log(randomPlayer);

            player.send(`Target: ${targetName}`).then(() => 
            {
                if (message.channel.type === "dm") return;
            })
            .catch((error) => 
            {
                // On failing, throw error.
                console.error(
                    `Could not send DM to ${player.tag}.\n`,
                    error
                );

                message.channel.send(`Could not send DM to ${player.tag}.\n`);
            });
        }

        nconf.set('game', game);
    }
}

function EndGame(message, game)
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
    }
}