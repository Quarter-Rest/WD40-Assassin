module.exports = {
	name: "shuffle",
	description: "Shuffle and reassign all targets.",

	execute(message, args) {

		if (global.adminIDs.includes(message.author.id) == false)
        {
            message.channel.send("You can't do this.")
            return;
        }

		global.con.query('SELECT * FROM `players`', function(err, results, fields) {
            if(err)
            {
                message.channel.send("SQL failed.");
                return;
            }

            let players = results;
			// Start index at one and wrap around on the last player
			let playerIndex = 1;
			players.forEach(playerData => {
				message.client.users.fetch(playerData.id).then(player => {
					if(player === undefined) 
					{
						message.channel.send("Caught an undefined player.");
					}
					let targetName = "error send griffon a dm";

					
					// TODO: Test this
                    players = players.filter(data => data.id != playerData.id);
					players = shuffle(players);

					let randomPlayer = players[playerIndex];
					playerIndex = playerIndex + 1;
					if(playerIndex > players.length - 1) playerIndex = 0;
                    console.log(randomPlayer)
                    console.log("-------------------------------------------");

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
					global.con.query(`UPDATE players SET alive = true, targetid = ${randomPlayer.id}, timeToRevive = 0, timeToGetNewTarget = 0 WHERE id = ${player.id}`, (err, row) => {
						// Return if there is an error
						if (err) {
							message.channel.send("SQL Failed");
							return console.error(err);
						}
					});
				})
			})
		});
	},
};

function shuffle(array) {
	let currentIndex = array.length,  randomIndex;
  
	// While there remain elements to shuffle.
	while (currentIndex != 0) {
  
	  // Pick a remaining element.
	  randomIndex = Math.floor(Math.random() * currentIndex);
	  currentIndex--;
  
	  // And swap it with the current element.
	  [array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}
  
	return array;
}
