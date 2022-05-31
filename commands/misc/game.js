const { createConnection } = require('mysql2');

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
            if(err)
            {
                message.channel.send("SQL connection lost. I will let you know when I am reconnected so you can try again.");

                // Prepare the mysql connection
                global.con = createConnection(mysql);

                // Then we are going to connect to our MySQL database and we will test this on errors
                global.con.connect(err => {
                    // Console log if there is an error
                    if (err) return console.log(err);

                    // No error found?
                    console.log(`MySQL has been connected!`);
                    message.channel.send("SQL connection reestablished.");
                });

                return;
            }

            let players = results;
            console.log(players)

            global.con.query('SELECT * FROM `game`', function(err1, results1, fields1) {
                let game = results1;
                console.log(results1);

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

        players.forEach(playerData => {
            let player = message.client.users.fetch(playerData.id).then(()=>{})

            if(player === undefined) {
                message.channel.send("Caught an undefined player.");
            }
            let targetName = "error send griffon a dm";

            let keys = Object.keys(players);
            let randomPlayerID = keys[ keys.length * Math.random() << 0];
            
            targetName = message.client.users.fetch(randomPlayerID).username;
            
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
            });
        });

        // Set game running
        global.con.query(`UPDATE game SET running = true`, (err, row) => {
            // Return if there is an error
            if (err) {
                message.channel.send("Failed");
                return console.log(err);
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
        message.channel.send("Ending game.")
        global.con.query(`UPDATE game SET running = false`, (err, row) => {
            // Return if there is an error
            if (err) {
                message.channel.send("Failed");
                return console.log(err);
            }
        });
    }
}