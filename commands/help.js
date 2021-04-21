
const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'help',
    description: 'show all comands available',
    execute(message, args) {
        const embed = new MessageEmbed()
            .setTitle("Comand List")
            .setColor(0xff0000)
            .addField("Death Counter - $death ", "\u200b")
            .addField("Call - $call", "\u200b ")
            .addField("Profile - $profile", "\u200b ")

        //send embed and add reations
        message.channel.send(embed);
    }
}