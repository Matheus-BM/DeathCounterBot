

module.exports = {
    name: 'call',
    description: 'get the bot into the call',
    async execute(message, args) {
        //checks if user is on a voice channel
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send(
                "You need to be in a voice channel to call the bot!"
            );
        }
        try {
            // Here we try to join the voicechat and save our connection into our object.
            await voiceChannel.join();

        } catch (err) {
            // Printing the error message if the bot fails to join the voicechat
            console.log(err);
        }



    }
}