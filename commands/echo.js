const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies back with your number')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('An integer')),
    async execute(interaction) {

        const response = interaction.options.getInteger('number');

        if (response == null) {
            await interaction.reply('Didn’t send a number!');
        }
        else {
            await interaction.reply(response);
        }


    }
}