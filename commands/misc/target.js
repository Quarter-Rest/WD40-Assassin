module.exports = {
	name: "target",

	execute(message, args) {
        global.con.query('SELECT * FROM `players`', function(err, results, fields) {
            let players = results;

            message.channel.send("DM'ing you your target.")
            
            let user = message.author;
            players.some(element => {
                if (element.id === user.id) {
                    let targetID = element.targetid;
                    
                    message.client.users.fetch(targetID).then(target => {
						targetName = target.username;
						
						user.send(`Current Target: ${targetName}`).then(() => 
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
					}).catch(err => {
						global.con.query(`SELECT * FROM 'players' WHERE id = ${user.id}`, function(err, results, fields) {
							let minutesTillNewTarget = (results.timeToGetNewTarget - Date.now()) / 60000;
							user.send(`No target. You will receive a new target in ${minutesTillNewTarget} minutes.`).then(() => 
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
						});
                    })
                    return;
                }
            });
        });
	},
};
