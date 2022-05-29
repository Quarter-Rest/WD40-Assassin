var nconf = require('nconf');
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: "player",
    aliases: "players",
    description: "Player commands",

	execute(message, args) 
    {
        const commandType = args[0].toLowerCase();
        let save = false;

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

        if(commandType == "remove")
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
                message.channel.send("No players.");
                return;
            }

            if(players.includes(user.id))
            {
                const index = players.indexOf(user.id);
                if (index > -1) {
                    players.splice(index, 1); // 2nd parameter means remove one item only
                }

                nconf.set('players', players);
                message.channel.send("Removed.");
                save = true;
            }
            else
            {
                message.channel.send("That player is not in the game.");
            }
        }

        if(commandType == "get")
        {
            let players = nconf.get('players');
            if(players === undefined)
            {
                players = [];
            }

            let embed = new MessageEmbed()
            .setColor('#0099ff')
			.setTitle('Players');

            players.forEach(id => {
                console.log(message.client.users.cache.get(id).username)
                embed.addField("Player", message.client.users.cache.get(id).username, true)
            }); 
            message.channel.send({embeds: [embed]});
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
