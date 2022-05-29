var nconf = require('nconf');
module.exports = {
	name: "nconftest",
    args: true,
	execute(message, args) 
    {
        
        nconf.use('file', { file: './data.json' });
        nconf.load();
        nconf.set('name', 'Avian');

        message.channel.send(nconf.get('name'));

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
