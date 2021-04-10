// Run dotenv
require('dotenv').config();
const config = require('./config.json');
const prefix = config.prefix;

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log(`${client.user.tag} - meme cannons primed`);
	client.user.setPresence({
        status: "online",  //You can show online, idle....
        game: {
            name: "]help",  //The message shown
            type: "WATCHING" //PLAYING: WATCHING: LISTENING: STREAMING:
        }
    });
});

//client.login(process.env.DISCORD_TOKEN);

client.login(config.token);

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// console.log();
	// console.log();
	// console.log('---------------');
	// console.log();
	// console.log();

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
	// console.log('.'+command+'.');
	// if(command==='ava'){
	// 	if (!message.mentions.users.size) {
	// 		console.log(`${message.author.username} avatar`)
	// 	 return message.channel.send(`Your avatar: ${message.author.avatarURL}`);
	// 	}
	// 	const taggedUser = message.mentions.users.first();
	// 	const avatarList = message.mentions.users.map(user => {
	// 		return message.channel.send( `${user.username}'s avatar: <${user.displayAvatarURL}>`);
	// 	});
	// 	message.channel.send(avatarList);
	// }	else if(command==='typer'){
	// 	message.reply(message.author.typingDurationIn(message.channel));
	// } else
	if (command ==='quote'|| command==='randomQuote'){
		var taggedUser = message.mentions.users.first();
		// console.log(message.mentions.users.size);
		if (!message.mentions.users.size) {
			// console.log('hiya');
			taggedUser = message.author;
		}
		// console.log('taggedUser');
		// console.log(taggedUser);
		const guild = message.guild;
		try{
			const channels = guild.channels.cache.filter(it => it.isText()&&it.viewable);
			//console.log(channels);
			const candidates = new Map();
			var count = 0;
			var result = null;
			var embed = null;

			channels.forEach(async (chan, i) => {
				await chan.messages.fetchPinned().then(messages => messages.filter(m => command==='randomQuote' || m.author.id === taggedUser.id).forEach((item, i) => {
					// console.log('test');
					// console.log(item);
					candidates.set(i, item);
				})
				);
				// console.log(count);
				count++;
				if(count==channels.size){
					// console.log('candidates:');
					// console.log(candidates);
					const key = getRandomKey(candidates);
					//console.log(key);
					result = candidates.get(key);

					//console.log('test');
					//console.log(candidates);
					if(result == null){
						// console.log('messaging');
						message.channel.send('pinless :(');
						return;
					}
					// console.log(result.content);
					// console.log(result.attachments);
					// console.log(result.embeds.size);
					var imageUrl = '';
					if(result.attachments){
						const bob = result.attachments.get(Array.from(result.attachments.keys())[0]);
						if(bob) imageUrl = bob.url;
					}
					//message.channel.send(candidates.get(key).content);
					embed = new Discord.MessageEmbed()
						.setColor('#0099ff')
						.setTitle(result.content)
						.setAuthor(result.author.username, result.author.avatarURL())
						//TODO: handle multiple image/attachments?
						.setImage(imageUrl)
						.setFooter(`#${result.channel.name}` + `, ${result.createdAt.toLocaleDateString("en-US")} ${result.createdAt.toLocaleTimeString('en-US')}`);
						// console.log('embedding');
						message.channel.send(embed);
					return;
				}
			});//.catch(error => {console.log('someError: ' + error)});// message.channel.send(`<#${result.channel.id}>`);
		} catch (error) {
			console.log('final catch');
			console.log(error);
		}

		// console.log('hey');console.log(result);

		//message.channel.send(embed);


		//candidates.then(it => console.log(it.size));
		//candidates.then( asdf => asdf.foreach(temp => temp));

	// 	const channel = client.channels.cache.get("157886798423392256");
	// 	console.log('begin');
	// // 	channel.messages.fetch()
  // // //.then(messages => console.log(`${messages.filter(m => m.author.id === '128668564617035776').size} messages`))
	// // .then(messages => messages.filter(m => m.author.id === '128668564617035776').forEach(message => {console.log(message.content)}));
	// channel.messages.fetchPinned()
  // .then(messages => console.log(`${messages.size} messages`))
	//
	// //channel.messages.fetchPinned().then(messages => messages.filter(m => m.author.id === '128668564617035776').forEach(msg => {console.log(msg.content)}));
	//
	// var abc = channel.messages.fetchPinned().then(messages => messages.filter(m => m.author.id === '128668564617035776'));
	//
	// abc.then(test => console.log(test.randomKey(1)));

	} else if (command === 'help'){
		help(message);
	} else if (command === 'goli'){
		goli(message);
	// } else if (command === 'r') {
	// 	var s = Math.floor(Math.random() * args[0]);
	// 	if(s==null || s.equals('NaN')){
	//		return
	//	}
	// 	else if (s.equals('2016')){
	// 		s='Brap brap rang gang 2016';
	// 	}
	// 	message.channel.send(s)
	}

});

function goli(message) {
	message.channel.send('what u wearin');
}

function help(message) {
	message.channel.send('type "]quote <@Username>" or just "]quote" for self quote.  Currently I just quote from pins so i dont get banned for making too many requests');
}

function getRandomKey(collection) {
		let keys = Array.from(collection.keys());
		return keys[Math.floor(Math.random() * keys.length)];
}
function getFirstKey(collection) {
		let keys = Array.from(collection.keys());
		return keys[Math.floor(Math.random() * keys.length)];
}
