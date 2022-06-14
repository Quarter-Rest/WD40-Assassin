module.exports = {
	name: "newtarget",
	description: "Give a player a new target.",

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

            if(userData.alive === 0)
            {
                message.reply("That player is dead.");
                return;
            }

            let otherPlayers = players.filter(data => data.id != user.id);
            let randomPlayer = otherPlayers[Math.floor(Math.random()*otherPlayers.length)];
            let targetName = "error send griffon a dm";

            message.client.users.fetch(randomPlayer.id).then(target => {
                targetName = target.username;
                
                user.send(`New Target: ${targetName}`).then(() => 
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
                });
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
