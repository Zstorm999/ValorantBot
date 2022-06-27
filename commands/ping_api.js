const { SlashCommandBuilder } = require('@discordjs/builders');

const { request } = require('undici');

const { valorantToken } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pingvalorant')
        .setDescription('Checks that the Valorant API is online'),
    async execute(interaction) {

        await interaction.deferReply();

        const {
            statusCode,
        } = await request(`https://eu.api.riotgames.com/val/status/v1/platform-data?api_key=${valorantToken}`);

        if (statusCode != 200) {
            interaction.editReply(`There was an error connecting with the Valorant api. Response code: ${statusCode}`)
        }
        else {
            interaction.editReply(`Pong from Valorant!`);
        }
    }
}

async function getJsonResponse(body) {
    let fullBody = '';

    for await (const data of body) {
        fullBody += data.toString();
    }

    return JSON.parse(fullBody);
}