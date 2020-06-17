const Path = require('path')
const FS = require('fs')

module.exports = {
	RegisterCommands: async function() {
		//  This will require() all scripts in ./commands.
		//  This will not require non-js scripts (ex: ts, txt, md, blah blah)

		let CommandDir = Path.dirname(__dirname) + "/shard/commands";
		let Files = FS.readdirSync(CommandDir);

		Files.forEach((Script) => {
			let Portions = Script.split(".");
			let File = Portions[Portions.length - 1];
			let Name = Portions[0];

			if (File.toLowerCase() == "js") {
				require(`${CommandDir}/${Name}`);
			}
		});
	},
};