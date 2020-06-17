const Fetch = require('make-fetch-happen')
const Chalk = require('chalk')
const Settings = require('./config.json')

function GrabCurrentVersion() {
	let Package = require(`../package.json`);
	return Package.version;
}

async function GrabLatestVersion() {
	let Response = await Fetch(
		`https://raw.githubusercontent.com/${Settings.Update.Repository}/master/package.json`
	);
	let Body = await Response.json();
	return Body.version;
}

async function VersionParse(Version) {
	let Diff = Version.split(".");
	let Major = Number(Diff[0]);
	let Minor = Number(Diff[1]);
	let Patch = Number(Diff[2]);
	return {
		Major: Major,
		Minor: Minor,
		Patch: Patch,

		Full: Major * 100 + Minor * 10 + Patch,

		Parse: `${Major}.${Minor}.${Patch}`,
	};
}

async function Detect() {

    //  Grab the latest version
    let Version = await VersionParse(GrabCurrentVersion())
    let Latest = await VersionParse(await GrabLatestVersion())

    if (Latest.Full > Version.Full) {


        let ContentLength = 45;

        /*eslint-disable */
		
        let Lines = [
            ``,
            `${Chalk.yellowBright(`${Chalk.bold("Noobert")} Auto-Update`)}`,
            `I'm outdated!`,
            ``,
            `Right now i'm on ${Chalk.red(Version.Parse)}`,
            `My latest version is ${Chalk.green(Latest.Parse)}`,
            `Run ${Chalk.bold(Chalk.blue(`npm run update`))} to update me!`,
            ``,
            `Tip: run ${Chalk.blue(`npm run update --override`)} to`,
            `force the update.`,
            ``,
        ]

        let Raw = [
            ``,
            `Noobert Auto-Update`,
            `I'm outdated!`,
            ``,
            `Right now i'm on ${Version.Parse}`,
            `My latest version is ${Latest.Parse}`,
            `Run npm run update to update me!`,
            ``,
            `Tip: run npm run update --override to`,
            `force the update.`,
            ``,
        ]
		
        let Message = `╭─────${"─".repeat(ContentLength)}─────╮`;
		
        for (let Number in Lines) {
            let Line = Lines[Number]
            let Pure = Raw[Number]

            let Current = `\n│     ${Line}     ${" ".repeat(
                ContentLength - Pure.length
            )}│`;

            Message = Message + Current
        }

        Message =
            Message + `\n╰─────${"─".repeat(ContentLength)}─────╯`;
	

        /*eslint-enable*/
        console.log(Message);
    }

}

Detect()