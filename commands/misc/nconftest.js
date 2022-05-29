var nconf = require('nconf');
module.exports = {
	name: "nconftest",

	execute(message, args) 
    {
        nconf.use('file', { file: './config.json' });
        nconf.load();
        nconf.set('name', 'Avian');
        nconf.set('dessert:name', 'Ice Cream');
        nconf.set('dessert:flavor', 'chocolate');

        message.channel.send(nconf.get('dessert'));

        nconf.save(function (err) 
        {
            if (err) {
                console.error(err.message);
                return;
            }
            message.channel.send('Configuration saved successfully.');
        });
	},
};
