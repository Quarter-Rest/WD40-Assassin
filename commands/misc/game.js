var nconf = require('nconf');

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
        let save = false;

        nconf.use('file', { file: './data.json' });
        nconf.load();
        let players = nconf.get('players');
        let game = nconf.get('game');
        if(game === undefined)
        {
            game = 
            [
                started = false
            ];
        }

        if(commandType == "start")
        {
            if(game.started != undefined && game.started)
            {
                message.channel.send("A game already exists!")
            }
            else
            {
                message.channel.send("Starting game.")
                game.started = true;
                nconf.set('game', game);
            }
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
