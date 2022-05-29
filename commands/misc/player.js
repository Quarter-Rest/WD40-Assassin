var nconf = require('nconf');
module.exports = {
	name: "player",
    aliases: "players",
    description: "Player commands",

	execute(message, args) 
    {
        const commandType = args[0].toLowerCase();
        const save = false;

        nconf.use('file', { file: './data.json' });
        nconf.load();

        if(commandType == "add")
        {
            const user = message.mentions.users.first();
            if (user === undefined) 
            {
                message.channel.send("That is not a valid user.");
                return; // Do not proceed, there is no user.
            }

            let players = nconf.get('players');
            if(players === undefined)
            {
                players = [];
            }

            if(players.includes(user.id) === false)
            {
                players.push(user.id);
                nconf.set('players', players);
                message.channel.send("Added.");
                save = true;
            }
            else
            {
                message.channel.send("That player is already in the game.");
            }
        }

        if(commandType == "get")
        {
            let players = nconf.get('players');
            if(players === undefined)
            {
                players = [];
            }

            let printString = "Players:\n";
            players.forEach(id => {
                console.log(message.client.users.cache.get(id).username)
                printString.concat(message.client.users.cache.get(id).username)
                printString.concat("\n")
            }); 
            message.channel.send(printString);
        }

        if(save)
        {
            nconf.save(function (err) 
            {
                if (err) {
                    message.channel.send(err.message);
                    return;
                }
            });
        }
	},
};
