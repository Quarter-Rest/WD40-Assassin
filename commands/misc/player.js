var nconf = require('nconf');
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: "player",
    aliases: "players",
    description: "Player commands",

	execute(message, args) 
    {
        if (global.adminIDs.includes(message.author.id) == false)
        {
            message.channel.send("You can't do this.")
            return;
        }

        const commandType = args[0].toLowerCase();

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
                players = {};
            }

            if(!(user.id in players))
            {
                players[user.id] = {target: null, alive: true};
                nconf.set('players', players);
                message.channel.send("Added.");
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

            if(user.id in players)
            {
                delete players[user.id];

                nconf.set('players', players);
                message.channel.send("Removed.");
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
                players = {};
            }

            let embed = new MessageEmbed()
            .setColor('#0099ff')
			.setTitle('Players');

            for (const [id, data] of Object.entries(players)) 
            {
                console.log(message.client.users.cache.get(id));
                embed.addField("Player", message.client.users.cache.get(id).username, true)
            }

            message.channel.send({embeds: [embed]});
        }

        nconf.save(function (err) 
        {
            if (err) {
                message.channel.send(err.message);
                return;
            }
        });
        
	},
};
