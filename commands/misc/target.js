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
                    console.log(targetID);
                    players.some(element2 => {
                        if (element2.id === targetID) {
                            user.send(`Current Target: ${element2.username}`).then(() => 
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
                            return;
                        }
                    });
                    return;
                }
            });
        });
	},
};
