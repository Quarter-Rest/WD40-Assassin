module.exports = {
	name: "points",

	execute(message, args) {
		if (global.adminIDs.includes(message.author.id) == false)
        {
            message.channel.send("You can't do this.")
            return;
        }

        let commandType = "";

        if(args[0] === undefined)
        {
            message.channel.send("Please give an arg. Reset | Set | Add")
			return;
        }

        commandType = args[0].toLowerCase();
		console.log(commandType);

		if(commandType == "reset")
		{
			global.con.query(`UPDATE players SET points = 0`, (err, row) => {
				// Return if there is an error
				if (err) {
					message.channel.send("SQL Failed");
					return console.error(err);
				}
			});
			return;
		}

		if(commandType == "set")
		{
			const user = message.mentions.users.first();
			if (user === undefined) 
			{
				message.reply("That is not a valid user.");
				return; // Do not proceed, there is no user.
			}

			if(args[2] === undefined)
			{
				message.reply("Please give a point amount.");
				return;
			}

			let newPoints = args[2];
			global.con.query(`UPDATE players SET points = ${newPoints} WHERE id = ${user.id}`, (err, row) => {
				// Return if there is an error
				if (err) {
					message.channel.send("SQL Failed. Probably that player isn't in the game.");
					return console.error(err);
				}
			});
		}

		if(commandType == "add")
		{
			const user = message.mentions.users.first();
			if (user === undefined) 
			{
				message.reply("That is not a valid user.");
				return; // Do not proceed, there is no user.
			}

			if(args[2] === undefined)
			{
				message.reply("Please give a point amount.");
				return;
			}

			global.con.query('SELECT * FROM `players`', function(err, results, fields) {
				if(err)
				{
					message.channel.send("SQL failed.");
					return;
				}
	
				let players = results;


				let newPoints = args[2];
				players.some(element => {
                    if (element.id === user.id) {
                        newPoints = newPoints + element.points;
                    }
				});

				global.con.query(`UPDATE players SET points = ${newPoints} WHERE id = ${user.id}`, (err, row) => {
					// Return if there is an error
					if (err) {
						message.channel.send("SQL Failed. Probably that player isn't in the game.");
						return console.error(err);
					}
				});
			});
		}
		
	},
};
