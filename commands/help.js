
const { MessageEmbed } = require('discord.js');
const fs = require('fs');


module.exports = {
    name: 'help',
    cmd: '$help',
    description: 'show all comands available',
    execute(message, args, client) {
        const embed = new MessageEmbed()
            .setTitle("Comand List")
            .setColor(0xff0000)

        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);

            embed.addField(`${client.commands.get(command.name).name} - ${client.commands.get(command.name).cmd}`, client.commands.get(command.name).description);

        }

        //send embed and add reations
        message.channel.send(embed);
    }
}