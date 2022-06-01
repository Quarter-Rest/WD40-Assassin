const { MessageEmbed } = require('discord.js');
module.exports = {
	name: "kill",
    description: "Kill another player.",

	execute(message, args) 
    {
        global.con.query('SELECT * FROM `players`', function(err, results, fields) {
            if(err)
            {
                message.channel.send("SQL Failed")
                console.error(err);
            }

            let players = results;
            let authorData = players.find( ({ id }) => id === message.author.id );
            if(authorData === undefined)
            {
                message.reply("You aren't in the game.");
                return;
            }

            if(authorData.alive == 0)
            {
                message.reply("You aren't alive.");
                return;
            }
            
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

            if(userData.alive == 0)
            {
                message.reply("That player is dead.");
                return;
            }

            if(userData.id === authorData.id)
            {
                message.reply("Sorry, you cannot kill yourself.")
                return;
            }
            
            global.con.query('SELECT * FROM `game`', function(err1, results1, fields1) {
                if(err1)
                {
                    message.channel.send("SQL failed.");
                    console.error(err1);
                    return;
                }

                let game = results1[0];
                if(game.running === 0)
                {
                    message.reply("There is no game running.")
                    return;
                }

                // https://stackoverflow.com/questions/45856446/how-do-i-wait-for-a-reply-in-discord-js
                const filter = (m) => m.author.id === message.author.id;
                message.reply("Are you sure you want to kill that player? This cannot be undone and everyone playing will be notified that you have done this.")
                .then(() => 
                {
                    message.channel.awaitMessages({filter: filter, max: 1, time: 30000, errors: ['time']})
                    .then(message => 
                    {
                        message = message.first()

                        if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') 
                        {
                            let killedData = players.find( ({ id }) => id === user.id );
                            KillPlayer(message.client, message, user, authorData, killedData, game);
                        } 
                        else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') 
                        {
                            message.channel.send(`Watch your fire next time.`)
                        } 
                        else 
                        {
                            message.channel.send(`Guess the bullet missed due to an invalid reply.`)
                        }
                    })
                    .catch(collected => 
                    {
                        message.channel.send('Guess the bullet missed due to an error.');
                        console.error(collected)
                    });
                })
            });

        });
	},
    timerHandler(client)
    {
        console.log("Running kill timers.");

        global.con.query('SELECT * FROM `players`', function(err, results, fields) {
            if(err)
            {
                message.channel.send("SQL Failed")
                console.error(err);
            }

            let players = results;

            players.forEach(playerData => {
                if(playerData.alive == 0) ReviveTimer(client, playerData);
            });
        });
    },
};

function ReviveTimer(client, playerData)
{
    let curTime = Date.now();
    let timeToEnd = playerData.timeToRevive;
    setTimeout(() => {
        global.con.query(`UPDATE players SET alive = true, timeToRevive = 0 WHERE id = ${playerData.id}`, (err, row) => {
            if (err) {
                return console.error(err);
            }

            // DM player
            client.users.fetch(playerData.id).then(player => {
                player.send(`You are now revived.`).then(() => 
                {
                    RandomTarget(client, player, playerData);
                })
                .catch((error) => 
                {
                    // On failing, throw error.
                    console.error(
                        `Could not send DM to ${player.tag}.\n`,
                        error
                    );
                });
            });
        });
    }, timeToEnd - curTime);
}

function RandomTarget(client, player, playerData)
{
    global.con.query('SELECT * FROM `players`', function(err, results, fields) {
        if(err)
        {
            console.error(err);
            return;
        }

        let players = results;

        // Do a bit of randomization on all other players
        let otherPlayers = players.filter(data => data.id != playerData.id);

        let keys = Object.values(otherPlayers);
        let randomPlayer = keys[ keys.length * Math.random() << 0];

        client.users.fetch(randomPlayer.id).then(target => {
            targetName = target.username;
            
            player.send(`New Target: ${targetName}`).then(() => 
            {})
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
        global.con.query(`UPDATE players SET targetid = ${randomPlayer.id} WHERE id = ${player.id}`, (err, row) => {
            // Return if there is an error
            if (err) {
                return console.error(err);
            }
        });
    });
}

function KillPlayer(client, message, killedPlayer, authorData, killedData, game)
{
    let curTime = Date.now()
    let timeToRevive = curTime + game.respawnTime;
    let timeToGetNewTarget = curTime + game.newTargetTime;

    // Killed target
    if(authorData.targetid == killedPlayer.id)
    {
        // Kill player
        global.con.query(`UPDATE players SET alive = false, targetid = '0', timeToRevive = ${timeToRevive} WHERE id = ${killedPlayer.id}`, (err, row) => {
            if (err) {
                message.channel.send("SQL Failed");
                return console.error(err);
            }
            killedData.timeToRevive = timeToRevive;
            ReviveTimer(client, killedData);
        });

        let points = authorData.points + 1;

        // In the rare case that a target went both ways, add an extra point.
        if(killedData.targetid == authorData.id)
        {
            points = points + 1;
            message.channel.send(`<@&${global.roleID}>. ${killedPlayer.username} was killed by their assassin: ${message.author.username} who was also their target! (+2)`);
        }
        else
        {
            message.channel.send(`<@&${global.roleID}>. ${killedPlayer.username} was killed by their assassin: ${message.author.username}! (+1)`);
        }

        // Give point to assassin 
        global.con.query(`UPDATE players SET points = ${points}, targetid = '0' WHERE id = ${message.author.id}`, (err, row) => {
            if (err) {
                message.channel.send("SQL Failed");
                return console.error(err);
            }
        });
    }
    // Killed assassin
    else if(killedData.targetid == authorData.id)
    {
        // Kill assassin and remove target
        global.con.query(`UPDATE players SET alive = false, timeToRevive = ${timeToRevive}, targetid = '0' WHERE id = ${killedPlayer.id}`, (err, row) => {
            if (err) {
                message.channel.send("SQL Failed");
                return console.error(err);
            }

            killedData.timeToRevive = timeToRevive;
            ReviveTimer(client, killedData);
        });

        let points = authorData.points + 1;
        // Give point to target
        global.con.query(`UPDATE players SET points = ${points} WHERE id = ${message.author.id}`, (err, row) => {
            if (err) {
                message.channel.send("SQL Failed");
                return console.error(err);
            }
        });

        message.channel.send(`<@&${global.roleID}>. ${killedPlayer.username} was killed by their target: ${message.author.username}! (+1)`);
    }
    //
    // Unrelated player ----------------------- THIS NEEDS TO BE TESTED
    //
    else
    {
        global.con.query(`UPDATE players SET alive = false, targetid = '0' WHERE id = ${message.author.id}`, (err, row) => {
            if (err) {
                message.channel.send("SQL Failed");
                return console.error(err);
            }
            authorData.timeToRevive = timeToRevive;
            ReviveTimer(client, authorData);

            message.channel.send(`<@&${global.roleID}>. ${message.author.username} tried to RDM ${killedPlayer.username} and is now dead! (+0)`);
            message.channel.send(`${message.author.username}'s assassin will receive a point and get a new target as if they made the kill.`);
        });

        global.con.query('SELECT * FROM `players`', function(err, results, fields) {
            if(err)
            {
                console.error(err);
                return;
            }
    
            let players = results;
            players.forEach(playerData => {
                if(playerData.targetid == authorData.id) 
                {
                    let points = playerData.points + 1;
                    global.con.query(`UPDATE players SET targetid = '0', points = ${points} WHERE id = ${message.author.id}`, (err, row) => {
                        if (err) {
                            return console.error(err);
                        }
                    });

                    client.users.fetch(playerData.id).then(player => {
                        player.send(`Your target died and you have recieved a point.`).then(() => 
                        {})
                        .catch((error) => 
                        {
                            // On failing, throw error.
                            console.error(
                                `Could not send DM to ${player.tag}.\n`,
                                error
                            );
                        });
                    })

                    return;
                }
            });
        });
    }
}
