const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Some info about me'),
    async execute(interaction) {
        await interaction.reply('Hello, I’m Valorant End Game bot !\n \
I was made by Zstorm, you can find my source code here: \
https://github.com/Zstorm999/ValorantBot\n \
My current version is `0.2.2`');
    }
}