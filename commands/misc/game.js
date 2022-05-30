const JSONdb = require('simple-json-db');
const db = new JSONdb('./data.json');

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

        global.con.query('SELECT * FROM `players`', function(err, results, fields) {
            let players = results;

            global.con.query('SELECT * FROM `game`', function(err, results, fields) {
                let game = results;

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
            });
        });
        
	},
};

function StartGame(message, game, players)
{
    if(game.running === true)
    {
        message.channel.send("A game already exists!")
    }
    else
    {
        message.channel.send(`<@&${global.roleID}>. Starting game. Sending all current players a target in their DMs.`)

        for (const [id, data] of Object.entries(players)) 
        {
            let player = message.client.users.cache.get(id);
            if(player === undefined) continue;
            let targetName = "error send griffon a dm";

            let keys = Object.keys(players);
            let randomPlayerID = keys[ keys.length * Math.random() << 0];
            
            targetName = message.client.users.cache.get(randomPlayerID).username;

            player.send(`Target random: ${targetName}`).then(() => 
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

            // update player as alive
            global.con.query(`UPDATE players SET alive = true, target = ${randomPlayerID} WHERE id = ${player.id}`, (err, row) => {
                // Return if there is an error
                if (err) {
                    message.channel.send("Failed");
                    return console.log(err);
                }
                else message.channel.send(`Added ${user.username}.`);
            });
        }

        // Set game running
        global.con.query(`UPDATE game SET running = true`, (err, row) => {
            // Return if there is an error
            if (err) {
                message.channel.send("Failed");
                return console.log(err);
            }
            else message.channel.send(`Added ${user.username}.`);
        });
    }
}

function EndGame(message, game)
{
    if(game.running === false)
    {
        message.channel.send("A game doesn't exist!")
    }
    else
    {
        message.channel.send("Ending game.")
        global.con.query(`UPDATE game SET running = false`, (err, row) => {
            // Return if there is an error
            if (err) {
                message.channel.send("Failed");
                return console.log(err);
            }
            else message.channel.send(`Added ${user.username}.`);
        });
    }
}