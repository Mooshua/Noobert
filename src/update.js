const Fetch = require('make-fetch-happen')
const Path = require('path')
const FS = require('fs')
const Chalk = require('chalk')
const Common = require('common-tags')

const Settings = require('./config.json')

function GrabCurrentVersion() {
	let Package = require(`../package.json`)
	return Package.version
}

async function GrabLatestVersion() {
	let Response = await Fetch(
		`https://raw.githubusercontent.com/${Settings.Update.Repository}/master/package.json`
	)
	let Body = await Response.json()
	return Body.version
}

async function VersionParse(Version) {
	let Diff = Version.split('.')
	let Major = Number(Diff[0])
	let Minor = Number(Diff[1])
	let Patch = Number(Diff[2])
	return {
		Major: Major,
		Minor: Minor,
		Patch: Patch,

		Full: (Major * 100) + (Minor * 10) + Patch,
		
		Parse: `${Major}.${Minor}.${Patch}`
	}
}


async function GrabFile(Path,Parse,Modified) {
	let URL = `https://api.github.com/repos/${Settings.Update.Repository}/contents/${Path}`;

	let Response = await Fetch(URL, {
		method: "get",
		headers: {
			"User-Agent": "Noobert auto-updater (github Mooshua/Noobert)",
			"If-Modified-Since": (Modified && (new Date(Modified)).toUTCString()) || undefined,
		}
	});

	if (Response.status == 304) {
		console.log(`${Chalk.green("ABSTAINING")} File ${Path} was not updated since the last update.`)
		return null
		//	The file has not been updated since `Modified`.
	}

	let Body = await Response.json()


	if (Body.message) {
		return null
	}

	let Finish
	let Ratelimit = Number(Response.headers['X-Ratelimit-Remaining'])

	switch (Body.type) {
		case 'file': 

			//	Decode the fiiiiiile
			let File = Buffer.from(Body.content, 'base64').toString('utf-8')

			if (Parse) {
				File = JSON.parse(File)
			}

			Finish = File
			break;
		case undefined:

			Finish = {
				type: "dir",
				dir: Body,
			}
			break;
	}

	return Finish
}

async function Download(URL) {
	let Response = await Fetch(URL)

	return Response
}



async function Update() {

	let Parent = Path.dirname(__dirname)

	async function Dive(Results) {

		if (Results) {
			if (Results.type == "file") {
				//	Oops.
				//	We're supposed to only use this for directories.
				console.log(Chalk.red("ERROR") + " Accidentally downloaded file. Path: "+ Results.path)

			} else if (Results.type == "dir") {

				Results.dir.forEach(async File => {
					let Path = `${Parent}/${File.path}`;

					let Stats = FS.statSync(Path)

					if (File.type == "dir") {
						let More = await GrabFile(File.path, false, Stats.mtimeMs);

						console.log(`${Chalk.green("SCOUTING")} Found ${Chalk.bold(File.path)}.`)

						await Dive(More)
					} else {
						console.log(
							`${Chalk.blue("DOWNLOADING")} Downloading ${
								File.name
							}`
						);
						let Raw = await Download(File.download_url)
						
						console.log(`${Chalk.blue("INSTALLING")} Installing ${File.name}.`)

						FS.writeFileSync(Path, Raw)
						
						console.log(
							`${Chalk.green("INSTALLED")} Successfully installed ${File.name}`
						);
					}
				})
			}
		}
	}

	let Stats = FS.statSync(`${Parent}/src`);
	let Init = await GrabFile('src',false,Stats.mtimeMs)
	Dive(Init)

}

Update()