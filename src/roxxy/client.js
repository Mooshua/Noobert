"use-strict"
const Fetch = require("make-fetch-happen")
const Promise = require("promise")
//const UID = require("uid-safe")

//const Group = require("./group")
const User = require("./user")
const Jar = require("./jar")

module.exports = class Client {
	/*
        The client:

        The client is supposed to be a minimal interface: Designed simply to de-clutter the
        rest of the codebase. This shouldn't be too complex.
    */

	Get(URL) {
		return new Promise((Resolve, Reject) => {
			Fetch(URL, {
				method: "get",
				headers: {
					"Cookie": this.Jar.Cookie
				},
				retry: {
					retries: 10,
					randomize: true
				}
			})
				.then(Res => {

					let SetCookie = Res.headers.raw()["set-cookie"]
					this.Jar.Cookie = SetCookie

					//  Return the body
					return Res.json()
				})
				.then(Body => {
					Resolve(Body)
				})
				.catch(Err => {
					Reject(Err)
				})
		})
	}

	Post(URL, Body, FormURL) {
		return new Promise(async (Resolve, Reject) => {
			try {
                
				let Response = await Fetch(URL, {
					method: "post",
					body: JSON.stringify(Body),
					headers: {
						Cookie: this.Jar.Cookie,
						"Content-Type":
                            (FormURL &&
                                "application/x-www-form-urlencoded; charset=UTF-8") || "application/json",
						"X-CSRF-TOKEN": this.CSRF
					},
				})

				this.CSRF = Response.headers.raw()["x-csrf-token"] || this.CSRF
				this.Jar.Cookie = Response.headers.raw()["set-cookie"]
                
				if (Response.status == 403) {
					//  sometimes, roblox will erraneously reject the request.
					//  we can resend it. this will work in most cases.

					Response = await Fetch(URL, {
						method: "post",
						body: JSON.stringify(Body),
						headers: {
							Cookie: this.Jar.Cookie,
							"Content-Type":
                                (FormURL &&
                                    "application/x-www-form-urlencoded; charset=UTF-8") ||
                                "application/json",
							"X-CSRF-TOKEN": this.CSRF,
						},
					})

				}

				this.CSRF = Response.headers.raw()["x-csrf-token"] || this.CSRF
				this.Jar.Cookie = Response.headers.raw()["set-cookie"]

				Resolve(Response.json())

			} catch (Err) {
				Reject(Err)
			}

		})
	}

	constructor(Cookie) {
		this.Jar = new Jar()
		//this.CSRF = UID.sync(12)

		this.Ready = new Promise((Resolve, Reject) => {
			try {
				//  Gather essential info about the client
				if (Cookie != undefined) {
					console.log("a.2")

					this.Jar.Cookie = { ".ROBLOSECURITY": Cookie }

					console.log("b")

					this.Get("https://users.roblox.com/v1/users/authenticated")
						.then((Userdata) => {
							console.log("c")
							this.Username = Userdata.displayName
							this.Id = Userdata.id

							Resolve()
						})
						.catch((Err) => {
							console.log("e" + Err)
							if (Err) Reject("Client" + Err)
						})
				} else {
					this.Anonymous = true
					Resolve()
				}
			} catch (Err) {
				console.log(Err, Err.stack)
				Reject(Err)
			}
		})
	}

	GetUser(Id) {
		return new Promise((Resolve, Reject) => {
			let NewUser = new User(this, Id)
			NewUser.Ready.then(() => {
				console.log("RealUser", NewUser)
				Resolve(NewUser)
			}).catch((Err) => {
				if (Err) Reject(Err)
			})
		})
	}
}
