var nconf = require('nconf');
module.exports = {
	name: "player",
    description: "Player commands",

	execute(message, args) 
    {
        const commandType = args[0].toLowerCase();
        const user = message.mentions.users.first();
        if (user === undefined) 
        {
            message.channel.send("That is not a valid user.");
            return; // Do not proceed, there is no user.
        }

        nconf.use('file', { file: './data.json' });
        nconf.load();

        if(commandType == "add")
        {
            let players = nconf.get('players');
            if(players === undefined)
            {
                players = [];
            }

            players.push(user);
            nconf.set('players', players);
        }

        nconf.save(function (err) 
        {
            if (err) {
                message.channel.send(err.message);
                return;
            }
            message.channel.send('Configuration saved successfully.');
        });
	},
};
