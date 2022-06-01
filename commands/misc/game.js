const { createConnection } = require('mysql2');
module.exports = {
	name: "game",
    description: "Game commands. Start, end, respawnTime(minutes), newTargetTime(minutes)",

	execute(message, args) 
    {
        if (global.adminIDs.includes(message.author.id) == false)
        {
            message.channel.send("You can't do this.")
            return;
        }

        const commandType = args[0].toLowerCase();

        global.con.query('SELECT * FROM `players`', function(err, results, fields) {
            if(err)
            {
                message.channel.send("SQL failed.");
                return;
            }

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

                if(commandType == "start")
                {
                    StartGame(message, game, players);
                }

                if(commandType == "end")
                {
                    EndGame(message, game, players);
                }

                if(commandType == "respawntime")
                {
                    if(args[1] === undefined) return;
                    let respawnTime = parseFloat(args[1]);
                    respawnTime = respawnTime * 60000
                    
                    global.con.query(`UPDATE game SET respawnTime = ${respawnTime}`, (err, row) => {
                        // Return if there is an error
                        if (err) {
                            message.channel.send("SQL Failed");
                            return console.error(err);
                        }

                        message.channel.send(`Set respawn time to ${args[1]} minutes.`);
                    });
                }
            });
        });
	},
    timerHandler()
    {
        console.log("Running game timers.");
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

        // Start index at one and wrap around on the last player
        let playerIndex = 1;
        players.forEach(playerData => {
            message.client.users.fetch(playerData.id).then(player => {
                if(player === undefined) 
                {
                    message.channel.send("Caught an undefined player.");
                }
                let targetName = "error send griffon a dm";

                // Do a bit of randomization on all other players
                //let otherPlayers = players.filter(data => data.id != playerData.id);

                //let keys = Object.values(otherPlayers);
                //let randomPlayer = keys[ keys.length * Math.random() << 0];
                let randomPlayer = players[playerIndex];
                playerIndex = playerIndex + 1;
                if(playerIndex > players.length - 1) playerIndex = 0;

                message.client.users.fetch(randomPlayer.id).then(target => {
                    targetName = target.username;
                    
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
                })


                // update player as alive and reset points
                global.con.query(`UPDATE players SET alive = true, targetid = ${randomPlayer.id}, points = 0 WHERE id = ${player.id}`, (err, row) => {
                    // Return if there is an error
                    if (err) {
                        message.channel.send("SQL Failed");
                        return console.error(err);
                    }
                });
            })
        })

        // Set game running
        global.con.query(`UPDATE game SET running = true`, (err, row) => {
            // Return if there is an error
            if (err) {
                message.channel.send("SQL failed");
                return console.error(err);
            }
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
        message.channel.send(`<@&${global.roleID}>. Ending game.`)
        global.con.query(`UPDATE game SET running = false`, (err, row) => {
            // Return if there is an error
            if (err) {
                message.channel.send("SQL failed");
                return console.error(err);
            }
        });
    }
}