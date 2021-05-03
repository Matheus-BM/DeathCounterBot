const deathCountSchema = require('../schemas/death-count-schema.js')
const mongo = require('../mongo.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'profile',
    cmd: '$profile',
    description: 'calls the mentioned user death profile',
    execute(message, args) {

        //strore mentioned client data
        let mention = message.mentions.users.first();
        if (!mention) { mention = message.author; }


        mongo().then(async (mongoose) => {
            const result = await deathCountSchema.find({ userId: mention.id }).exec()


            const embed = new MessageEmbed()
                .setTitle(mention.username + ' Profile')
                .setColor(0xff0000)
                .setFooter(mention.username, mention.avatarURL())
            result.forEach((entry, index) => {
                if (!result[index].resetCount) { result[index].resetCount = 0 }
                if (!result[index].regeCount) { result[index].rageCount = 0 }
                embed.addField(result[index].gameName, "\u200b" + result[index].deathCount + " mortes, \u200b \u200b " + result[index].resetCount + " resets, \u200b \u200b  " + result[index].rageCount + " rages. \u200b \u200b \n ");


            })


            //send embed and add reations
            message.channel.send(embed);

            mongoose.connection.close()
        })



    }

}