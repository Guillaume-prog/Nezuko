const fs = require('fs');

const Discord = require('discord.js');
const {prefix, token, adminRole} = require('./config.json');

const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

// Loading commands
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require('./commands/' + file);
    bot.commands.set(command.name, command);
}

// Startup + Ressource loading
bot.on("ready", () => {
    console.log(bot.user.username + " is online !");
});

// Create new role on join
bot.on('guildCreate', (guild) => {
    console.log("I joined a guild !");
});

// Dynamic command processing
bot.on('message', async msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

    // Check that the command exists
    if (!bot.commands.has(commandName))
        return msg.channel.send('Commande non trouvée');

    const command = bot.commands.get(commandName);

    if(command.role && !msg.member.roles.cache.some(r => r.name == command.role))
        return msg.channel.send('Tu n\'a pas le droit de faire cette commande');

    // Check the command can be ran in DMs
    if (command.guildOnly && msg.channel.type !== 'text')
        return msg.reply('Cette commande ne fonctionne pas en MP');
    
    // Arg count check
    if((command.args && args.length != command.args && command.args != -1) || (command.args == -1 && args.length == 0) || args[0] == '?') {
        let reply = "";

        if((command.args && args.length != command.args && args[0] != '?') || (command.args == -1 && args.length == 0))
            reply += 'Mauvais nombre d\'arguments !\n';
        
        if(command.usage)
            reply += `Usage: \`${prefix}${commandName} ${command.usage}\``;

        return msg.channel.send(reply);
    }

    // Execute command
    try {
        command.execute(msg, args, db);
    } catch (error) {
        console.error(error);
        msg.channel.send('On dirait que ca n\'a pas marché ...');
    }
});

bot.login(token);
