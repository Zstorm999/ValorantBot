require('./deploy-commands'); // register the commands first !

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const { Users } = require('./database.js');
const { time } = require('node:console');

client.commands = new Collection();
const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    Users.sync();

    const now = new Date();

    console.log(`Started at ${now.getDate}/${now.getMonth}/${now.getFullYear}, ${now.getHours}:${now.getMinutes}:${now.getSeconds}`);

    console.log(`Logged in as ${client.user.tag}!`);



});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.log(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
})

client.login(token);





