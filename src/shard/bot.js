//  Bot.js

//  Modules
const Discord = require("discord.js")
const Client = new Discord.Client()

//  Custom
const Register = require("../core/register");
const Roblox = require("../roxxy");
const Core = require('./core')

//  System
const FS = require("fs");

Client.on('ready', () => {

    //  Load in commands
    Core.Setup.RegisterCommands()
})

Client.on("message", Message => {

    //
})
