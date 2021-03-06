var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Run dotenv
require('dotenv').config();
const config = require('./config.json');
const credentials = require('./credentials.json');
const prefix = config.prefix;

const Discord = require('discord.js');
const client = new Discord.Client();

var loggingInfo = false;
var loggingDebug = true;
var loggingVerbose = false;
var weebFilter = false;

const errorEmojis = new Map([
		[0, '<:trigger_matt:570408483388653582>'],
		[1, '<:tjoml:540988468214366220>'],
		[2, '<:handless_think:540988467392544788>'],
		[3, '<:pingd:572942073200640020>'],
		[4, '<:bird:540988467069583382>']

	]);

const Sequelize = require('sequelize');
const sqlize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
const Users=require('./models/User')(sqlize, Sequelize.DataTypes);

client.once('ready', () => {
	console.log(`${client.user.tag} - meme cannons primed`);
	
	client.user.setPresence({
        status: "online",  //You can show online, idle....
        activity: {
            name: `The Room`,  //The message shown
            type: "WATCHING" //PLAYING: WATCHING: LISTENING: STREAMING:
        }
    });
});

client.login(credentials.token);

client.on('message', async message => {

	if(message.content.length > 300){
		message.channel.send(`Hahaha, what a story, ${message.author.username}.`)
	}

	if (message.content === '<:klog:731353873251565588>' && message.author.id === '108368315243614208'/*gypsy*/) {
		klogReact(message);
	}

	if (weebFilter 
			&& message.author.id === '116275390695079945'/*nadeko*/ 
			&&  message.embeds != null && message.embeds[0].description.startsWith('[link](https://safebooru.org/') 
			&& message.channel.id != '498964121430130708'/*nippon*/) {
		errorEmoji(message);
		message.delete();
	}

	if(message.author.bot) return;

	user = await Users.findOne({where:{userId: message.author.id}});
	incrementBalance(message, user);

	if (!message.content.startsWith(prefix)) return;

	logIt(message, loggingVerbose);

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	//public commands
	if (command ==='quote'|| command==='randomQuote'){
		//TODO: implement randomQuote and then separate them out
		quote(message, command);
	} else if (command === 'help'){
		help(message);
	} else if (command === 'room'){
		room(message);
	} else if (command === 'pick'){
		pickRandom(message, args);
	} else if (command === 'balance'){
		getBalance(message, user);
	} else if (command === 'leaderboard') {
		showLeaderboard(message);
	}

	//personal commands
	if (message.author.id === '128668564617035776'/*pico*/){
		if(command === 'logging'){
			changeLoggingMode(args);
		} else if (command === 'weebfilter'){
			weebFilter = !weebFilter;
		}

	}

});

function room(message) {
	const johnny = new Map([
		  [0, `YOU ARE TEARING ME APART, ${message.author.username.toUpperCase()}!`],
			[1, `Oh, hi, ${message.author.username}.`],
			[2, "They betray me, they didn't keep their promise, they trick me, and I don't care anymore."],
			[3, "Everybody betray me! I fed up with this world."],
			[4, "Do you understand life?! Do you?!"],
			[5, 'You know what they say, "Love is blind!"']
			//TODO:
			// [6, "God...forgive me."],
			,[7, "Anyway, how is your sex life?"]
			,[8, `Hahaha. What a story, ${message.author.username}!`]
			,[9, 'Cheep, cheep, cheep, cheep, cheep, cheep!']
		]);

	message.channel.send(johnny.get(getRandomKey(johnny)));
}

function randomTest(message) {
	const johnny = new Map([
		  [0, `YOU ARE TEARING ME APART, ${message.author.username.toUpperCase()}!`],
			[1, `Oh, hi, ${message.author.username}.`],
			[2, "They betray me, they didn't keep their promise, they trick me, and I don't care anymore."],
			[3, "Everybody betray me! I fed up with this world."],
			[4, "Do you understand life?! Do you?!"],
			[5, 'You know what they say, "Love is blind!"']
			//TODO:
			// [6, "God...forgive me."],
			,[7, "Anyway, how is your sex life?"]
			,[8, `Hahaha. What a story, ${message.author.username}!`]
			,[9, 'Cheep, cheep, cheep, cheep, cheep, cheep!']
		]);

		for (var i = 0; i < 10; i++) {
			var key = getRandomKey(johnny);
			logIt(`${key}  |  ${johnny.get(key)}`, loggingInfo);
		}
}

function pickRandom(message, args){
	if(args.length < 2){
		return errorEmoji(message);
	}
	message.channel.send(`${args[getRandomKey(args)]}`)
}

function goli(message) {
	message.channel.send('what u wearin');
}

function help(message) {
	message.channel.send(`${prefix}room\n${prefix}pick <2+ args>\n${prefix}balance\n${prefix}leaderboard`);
}

function quote(message, command) {

	var taggedUser = message.mentions.users.first();
	if (!message.mentions.users.size) {
		taggedUser = message.author;
	}

	const guild = message.guild;
	try{
		const channels = guild.channels.cache.filter(it => it.isText()&&it.viewable);
		const candidates = new Map();
		var count = 0;
		var result = null;
		var embed = null;

		channels.forEach(async (chan, i) => {
			await chan.messages.fetchPinned()
				.then(messages => messages
					.filter(m => command==='randomQuote' || m.author.id === taggedUser.id)
						.forEach((item, i) => candidates.set(i, item))
				);
			count++;
			if(count==channels.size){

				const key = getRandomKey(candidates);
				result = candidates.get(key);

				if(result == null){
					message.channel.send('pinless :(');
					return;
				}

				var imageUrl = '';

				if(result.attachments){
					const hasAttachment = result.attachments.get(Array.from(result.attachments.keys())[0]);
					if(hasAttachment) {
						imageUrl = bob.url;
					}
				}

				embed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle(result.content)
					.setAuthor(result.author.username, result.author.avatarURL())
					//TODO: handle multiple image/attachments? handle other URL types or something?
					.setImage(imageUrl)
					.setFooter(`#${result.channel.name}` + `, ${result.createdAt.toLocaleDateString("en-US")} ${result.createdAt.toLocaleTimeString('en-US')}`);

					message.channel.send(embed);

				return;
			}
		});
	} catch (error) {
		console.log('final catch');
		console.log(error);
	}

}

function klogReact(message) {
		const reactionEmoji = message.guild.emojis.cache.find(emoji => emoji.name === 'klog');
		message.react(reactionEmoji);
}

async function incrementBalance(message, user) {
  if(user==null){
    Users.upsert({userId:message.author.id,
    balance:0,
    smites:0
    })
    user = await Users.findOne({where:{userId: message.author.id}});
  }
  if(message.content.toLowerCase().includes('smite')) {
    newBalance = user.balance-10;
    logIt(`smited ${message.author.username}`, loggingDebug);
    logIt(user, loggingDebug);
    logIt(newBalance, loggingDebug);
    Users.upsert({userId:message.author.id, balance:newBalance, smites: user.smites+1})
  } else {
    newBalance=1+user.balance;
    Users.upsert({userId:message.author.id, balance:newBalance})
  }
  Users.upsert({userId:message.author.id, username:message.author.username});
}
function getBalance(message, user) {
  embed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle(`You have ${user.balance} Goslings available.` )
					.setAuthor(message.author.username, message.author.avatarURL())
					;

  message.channel.send(embed)
}
async function showLeaderboard(message) {
  embed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle(`Top Gosling Posters - All Time` )
					;

  userList = await Users.findAll({order:sqlize.literal('balance desc')});
  description = "";

    userList.forEach( 
      (user) => { 
        test = user.username
        if(typeof(test) !== 'undefined' && test !== null){
          padSize = 30;
          paddedUsername = test.padEnd(test.length+5, ' ').padEnd(padSize, '-')
          paddedBalance = user.balance.toString().padStart(5, ' ')
          description+=`\`${paddedUsername}${paddedBalance}\`\n`
        }
      }
    );

  embed.setDescription(description);

  message.channel.send(embed)
}

function getRandomKey(collection) {
		let keys = Array.from(collection.keys());
		return keys[Math.floor(Math.random() * keys.length)];
}

function errorEmoji(message){
	message.channel.send(errorEmojis.get(getRandomKey(errorEmojis)));
}
function changeLoggingMode(args) {
	loggingInfo = args[0]=='info';
	loggingDebug = args[0]=='debug';
	loggingVerbose = args[0]=='verbose';
	if(args[0]=='all'){
		loggingInfo=true;
		loggingDebug=true;
		loggingVerbose=true;
	}
	logIt(`Logging set to ${args[0]}`, loggingInfo);
}
function logIt(s, b){
	if(b){
		console.log(s);
	}
}

/*
//repl.it hosting stuff to ping
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('ok');
});
server.listen(3000);
*/
