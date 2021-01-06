const GUILD_ID = '777271048928100422';
const CHANNEL_ID = '777271048928100424';

const LAURENT_ID = '457278892063850507';

module.exports = {
    name: 'mp',
    desc: 'rends nezuko sentiente',
}

module.exports.execute = async (msg, args, db) => {
    if(msg.channel.type != 'dm' || msg.author.id != LAURENT_ID) return;

    const guild = msg.client.guilds.cache.get(GUILD_ID);
    const channel = guild.channels.cache.get(CHANNEL_ID);

    channel.send(args.join(' '));
    msg.delete();
}