const deathCountSchema = require('../schemas/death-count-schema.js')
const mongo = require('../mongo.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'deathCounter',
    description: 'calls the mentioned user death counter',
    execute(message, args) {

        //strore mentioned client data
        let mention = message.mentions.users.first();
        if (!mention) return message.channel.send('You need to mention a user.');

        // create embed
        try {
            var currentGame = mention.presence.activities[0].name;
        } catch { var currentGame = mention.username; }

        const embed = new MessageEmbed()
            .setTitle('Death Counter')
            .setColor(0xff0000)
            .setDescription("Incremente")
            .setFooter(currentGame, mention.avatarURL())


        //send embed and add reations
        message.channel.send(embed).then(function (sentMessage) {
            sentMessage.react('➖').then(() => sentMessage.react('➕')).catch(() => console.error('emoji failed to react.'));

            //Set colletor filter for reations
            const filter = (reaction, user) => {
                return ['➕', '➖'].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            //Create colletor
            const collector = sentMessage.createReactionCollector(filter, { max: 100, time: 600000, errors: ['time'] });

            //Start collector
            collector.on('collect', async (reaction, user) => {

                //connect to monogo db
                await mongo().then(async (mongoose) => {
                    try {
                        //On collect + or - reation increment deathCount
                        if (reaction.emoji.name == '➕') {
                            await deathCountSchema.findOneAndUpdate({ userId: mention.id, gameName: currentGame }, { $inc: { deathCount: 1 } }, { upsert: true }).exec()
                        } else {
                            await deathCountSchema.findOneAndUpdate({ userId: mention.id, gameName: currentGame }, { $inc: { deathCount: -1 } }, { upsert: true }).exec()
                        }
                        //Get deathCount Vallue from db
                        const result = await deathCountSchema.findOne({ userId: mention.id, gameName: currentGame }).exec()
                        var h = result.toObject();
                        sentMessage.edit(embed.setDescription("morreu " + h.deathCount + " vezes"));
                        // close mongo db connetion
                    } finally { mongoose.connection.close() }
                    //remove user reatction and stop collector
                    reaction.users.remove(user);
                    collector.stop;
                })
            })
        })
    }
}
