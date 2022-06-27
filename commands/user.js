const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../database.js');

const { request } = require('undici');

//const { Users } = require('../database.js');

const subCommands = new Map([
    ['register', registerUser],
    ['list', listUsers],
    ['delete', deleteUser],
])

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Manage users')
        .addSubcommand(subcommand =>
            subcommand
                .setName('register')
                .setDescription('Associate a Riot tag with a discord ID')
                .addUserOption(option => option.setName('who').setDescription('Discord ID').setRequired(true))
                .addStringOption(option => option.setName('riot').setDescription('Riot tag').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all registered users'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Removes an association')
                .addUserOption(option => option.setName('who').setDescription('Discord ID').setRequired(true))),
    async execute(interaction) {

        try {
            subCommands.get(interaction.options.getSubcommand())(interaction);
        }
        catch (error) {
            console.log(error);
            interaction.reply('Unknown command');
        }
    }
}

async function registerUser(interaction) {

    await interaction.deferReply();

    const discordTag = interaction.options.getUser('who');
    const riotTag = interaction.options.getString('riot');

    try {

        if (await checkRiotTag(riotTag)) {
            const user = await Users.create({
                discordTag: discordTag.id,
                riotTag: riotTag,
            });

            return interaction.editReply(`Successfully registered user ${discordTag} with Riot tag ${user.riotTag}.`);
        }
        else {
            return interaction.editReply(`The tag \`${riotTag}\` is not a valid Riot tag. Please verify your tag in-game.`);
        }
    }
    catch (error) {

        if (error.name === 'SequelizeUniqueConstraintError') {
            return interaction.editReply('This user is already registered.');
        }

        console.log(error);
        return interaction.editReply(`Something went wrong while adding the user.`);
    }
}

async function checkRiotTag(tag) {
    return true;
}

async function listUsers(interaction) {

    await interaction.deferReply();

    const usersList = await Users.findAll({
        attributes: ['discordTag', 'riotTag']
    });

    const usersString = usersList.map(u => '<@' + u.discordTag + '> is `' + u.riotTag + '`').join('\n') || 'No Users found.';

    return interaction.editReply(`**Found ${usersList.length} registered users**\n\n${usersString}`);
}

async function deleteUser(interaction) {

    const discordTag = interaction.options.getUser('who').id;

    const rowCount = await Users.destroy({ where: { discordTag: discordTag } });

    if (!rowCount) return interaction.reply('That user is not registered.');

    return interaction.reply('User unregistered');
}