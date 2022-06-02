/**
 * @file Sample Select-Menu interaction
 * @author Naman Vrati
 * @since 3.0.0
 */

module.exports = {
	id: "ping",

	/**
	 * @description Executes when a select menu option with ID "sample" is clicked.
	 * @author Naman Vrati
	 * @param {import("discord.js").SelectMenuInteraction} interaction The Interaction Object of the command.
	 */

	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions([
						{
							label: 'Select me',
							description: 'This is a description',
							value: 'first_option',
						},
						{
							label: 'You can select me too',
							description: 'This is also a description',
							value: 'second_option',
						},
					]),
			);

		await interaction.reply({ content: 'Pong!', components: [row] });
	},
};
