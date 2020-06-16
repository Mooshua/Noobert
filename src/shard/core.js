const Path = require('path')
const FS = require("fs")

/*
    Core.js
    collect core scripts
    yayyyy

*/

module.exports = {}

let CoreDir = Path.dirname(__dirname) + "\\core";
let Files = FS.readdirSync(CoreDir);


Files.forEach((Script) => {
    let Portions = Script.split(".");
    let File = Portions[Portions.length - 1];
    let Name = Portions[0];

    //  Gotta love the good 'ol PascalCase.
    let Pascal = (Name.charAt(0).toUpperCase()) + Name.substring(1,Name.length)

    if (File.toLowerCase() == "js") {
        let Module = require(`${CoreDir}/${Name}`);
        module.exports[Pascal] = Module
    }
})