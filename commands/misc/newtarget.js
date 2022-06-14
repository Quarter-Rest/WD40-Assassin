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

                let curTime = Date.now();
                let timeToGetNewTarget = curTime + game.newTargetTime;
                userData.timeToGetNewTarget = timeToGetNewTarget;
                const killCommand = message.client.commands.get("kill");
                killCommand.NewTargetTimer(client, userData);

                message.channel.send(`${user.username} will recieve a new target in six hours.`);

            });

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
