const deathCountSchema = require('../schemas/death-count-schema.js')
const mongo = require('../mongo.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'profile',
    description: 'calls the mentioned user death profile',
    execute(message, args) {

        //strore mentioned client data
        let mention = message.mentions.users.first();
        if (!mention) { mention = message.author; }


        mongo().then(async (mongoose) => {
            const result = await deathCountSchema.find({ userId: mention.id }).exec()

            const embed = new MessageEmbed()
                .setTitle('Death Counter')
                .setColor(0xff0000)
                .setFooter(mention.username, mention.avatarURL())
            result.forEach((entry, index) => {
                embed.addField(result[index].gameName, "\u200b" + result[index].deathCount + " mortes \u200b \u200b ");
            })


            //send embed and add reations
            message.channel.send(embed);

            mongoose.connection.close()
        })



    }

}