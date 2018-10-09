require('dotenv').load();

var Discord = require("discord.js");
import db from './config/database';
import Character from './models/character';
import Command from './models/command';

var bot = new Discord.Client();

const COMMAND_PREFIX = "!";

db.init = async () => { 
    //lookup and print all characters once after database is connected
    let res = await Character.allCharacters(); 
    console.log(res);
}

const commands = [
    new Command({
        name: 'help',
        description: 'list available commands',
        execution: help
    }),
    new Command({
        name: 'wallet',
        description: 'view your balance of gold',
        execution: wallet
    }),
    new Command({
        name: 'gift',
        description: '!gift <user> <amount> | transfer gold to another user',
        execution: gift
    }),
];

function help (msg) {
    let res = '```css\nCOMMANDS:\n```\n```\n';
    Object.keys(commands).forEach(key => {
        res += `${commands[key].name} : ${commands[key].description}\n`;
    });

    res += "```\n👋"

    msg.channel.send(res);
}

async function wallet (msg) {
    let char = await RetrieveCharacter(msg.author);

    msg.channel.send('```css\n' + `${char.data.name} has ${char.data.gold} gold... 💰` + '\n```');
}

async function gift (msg, info) {
    var cmds = info.split(' ');

    var amountToSend = parseFloat(cmds.pop());

    var toChar = null; 
    try {
        let name = cmds.join(' ');
        if (name.indexOf('<@') === 0) {
            name = name.replace('<@', '').replace('>', '');
            const char = new Character();
            await char.findById(name);
            toChar = char;
        }
        else 
            toChar = await Character.byName(name);
            
    } catch (er) { console.error(er); }

    if (!toChar) {
        msg.channel.send('.......wilson!!!!');
        return;
    }

    var fromChar = await RetrieveCharacter(msg.author);

    if (isNaN(amountToSend) || !amountToSend) {
        msg.channel.send('incorrect amount...187 dollars?!?!');
        return;
    }

    fromChar.transferGold(toChar, amountToSend)
    .then(res => {
        msg.channel.send(res);
    }).catch(er => { msg.channel.send(er); });
}

function RetrieveCharacter (author) {

    return new Promise((resolve, reject) => {
        let char = new Character();

        char.findById(author.id).then(res => {
            //if no character found in database lookup, create one...
            if (!res || !Object.keys(res).length) {
                char.mapData(Character.startCharacter(author));
                char.create().then(() => {
                    resolve(char);
                });

                return;
            }

            resolve(char);
        }).catch(reject);
    });
}

async function ProcessCommand (msg) {
    let info = msg.content.replace(COMMAND_PREFIX, '').replace('\n', ' ').trim().split(' ');
    let command = info.shift();

    console.log('COMMAND: ' + command);

    Object.keys(commands).forEach(key => {
        if (commands[key].name == command) {
            commands[key].execution(msg, info.length ? info.join(' ').trim() : null);
        }
    })
}

async function ProcessMessage (msg) {
    var char = await RetrieveCharacter(msg.author);

    xpValue = .42;

    var xpValue = msg.content.length / 10.42;

    if (msg.embeds && msg.embeds.length) xpValue += parseFloat(msg.embeds.length * 4.2); //images/youtube links bonus

    if (msg.attachments && msg.attachments.length) xpValue += 21;

    if (msg.mentions && msg.mentions.length) xpValue *= 1.42; //42% bonus if there is a mention

    if (xpValue <= .42 && !msg.content.length) xpValue += 21;

    xpValue *= 1.42;

    char.addXP(xpValue);
}

bot.on("message", function (msg) {
    //If bot message, return
    if (msg.author.id == bot.user.id) return; 

    //If command message, process it and return
    if (msg.content.indexOf(COMMAND_PREFIX) === 0) {
        ProcessCommand(msg);
        return;
    }

    ProcessMessage(msg);
});

bot.on('ready', function () {
     console.log('Bot is now active.');
});

bot.login(process.env.TOKEN);
