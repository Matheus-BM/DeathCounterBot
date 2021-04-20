const deathCountSchema = require('../schemas/death-count-schema.js')
const mongo = require('../mongo.js');
const { MessageEmbed } = require('discord.js');
const { connect } = require('mongoose');

module.exports = {
    name: 'deathCounter',
    description: 'calls the mentioned user death counter',
    execute(message, args) {

        //strore mentioned client data
        let mention = message.mentions.users.first();
        if (!mention) return message.channel.send('You need to mention a user.');
        console.log(mention.id);

        // create embed
        const embed = new MessageEmbed()
            .setTitle('Death Counter')
            .setColor(0xff0000)
            .setDescription("Incremente")

        //send embed and add reations
        message.channel.send(embed).then(function (sentMessage) {
            sentMessage.react('➖').then(() => sentMessage.react('➕')).catch(() => console.error('emoji failed to react.'));

            //Set colletor filter for reations
            const filter = (reaction, user) => {
                return ['➕', '➖'].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            //Create colletor
            const collector = sentMessage.createReactionCollector(filter, { max: 100, time: 600000, errors: ['time'] });

            //On collect + or - reation increment deathCount
            collector.on('collect', async (reaction, user) => {

                //connect to monot db
                await mongo().then(async (mongoose) => {
                    try {
                        if (reaction.emoji.name == '➕') {
                            const result = await deathCountSchema.findOneAndUpdate(
                                {
                                    _id: mention.id
                                },
                                {
                                    $inc: {
                                        deathCount: 1
                                    }
                                },
                                {
                                    upsert: true
                                }
                            ).exec()
                            var h = result.toObject();
                            p = h.deathCount;
                        } else {
                            const result = await deathCountSchema.findOneAndUpdate(
                                {
                                    _id: mention.id
                                },
                                {
                                    $inc: {
                                        deathCount: -1
                                    }
                                },
                                {
                                    upsert: true
                                }
                            ).exec()
                            var h = result.toObject();
                            p = h.deathCount;
                        }


                    } finally { mongoose.connection.close() }
                    sentMessage.edit(embed.setDescription(p));
                    reaction.users.remove(user);
                    collector.stop;
                })
            })
        })
    }
}
