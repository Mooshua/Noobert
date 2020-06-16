//  Bot.js
const Register = require("../core/register");
const Roblox = require("../roxxy");

const FS = require("fs");

//  Register commands

async function CollectRegisters() {
    //  This will require() all scripts in ./commands.
    //  This will not require non-js scripts (ex: ts, txt, md, blah blah)

    let CommandDir = __dirname + "/commands";
    let Files = FS.readdirSync(CommandDir);

    Files.forEach((Script) => {
        let Portions = Script.split(".");
        let File = Portions[Portions.length - 1];
        let Name = Portions[0];

        if (File.toLowerCase() == "js") {
            require(`${CommandDir}/${Name}`);
        }
    });
}

CollectRegisters();
