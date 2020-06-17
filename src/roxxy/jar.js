
/*
    I wrote this while debugging a 403 error.
    It didn't fix it, for those wondering.
    It's nice code, so here it will stay.
    - Moo
*/

module.exports = class Jar {

	constructor() {
		this.Cookies = {} 
	}

	get Cookie() {
		//  Serialize cookies into a string
		let Done = ""
		Object.keys(this.Cookies).forEach((Key) => {
			let Value = this.Cookies[Key]
			Done = `${Done}${Key}=${Value};`
		})
		return Done
	}

	set Cookie(NewCookie) {
		switch (typeof (NewCookie)) {
		case "string":
			NewCookie.split(/\s*;\s*/).forEach(function (pair) {
				pair = pair.split(/\s*=\s*/)
				let Name = pair[0]
				let Value = pair.splice(1).join("=")
				this.Cookies[Name] = Value
			})
			break
		case "object":
			Object.keys(NewCookie).forEach((Key) => {
				let Value = NewCookie[Key]
				this.Cookies[Key] = Value
			})
			break
		default:
			new Error("Was unable to set cookie contents (invalid type")
			break
		}

	}
}