const { Client, Intents, MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const mongo = require('./mongo.js');
const { prefix, token } = require('./config.json')
const fs = require('fs');




// Creates a colletion for all discord commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);

}

// Cosole log Check if bot and db are online
client.once('ready', async () => {
    console.log('Nice and Redy');
    client.user.setActivity('discord.js', { type: 'WATCHING' })

    await mongo().then(mongoose => {
        try {
            console.log('Connected to mongo!')
        } finally {
            mongoose.connection.close();
        }
    })

})

//Mesage handler
client.on('message', async message => {
    //check prefix on mensage
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    //comands check
    switch (command) {
        case 'death':
            client.commands.get('deathCounter').execute(message, args);
            break;

        case 'call':
            client.commands.get('call').execute(message, args);
            break;

        default:
            console.log(`Sorry, no ${expr} command found .`);

    }
});


client.login(token);
