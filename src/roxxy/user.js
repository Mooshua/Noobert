const Promise = require("promise")

module.exports = class User {
	constructor(Client,Id) {

		this.Client = Client
		this.Ready = new Promise((Resolve,Reject) => {

			switch(typeof(Id)) {
			case "string":

				//  Provided is a Username
				//  Grab the ID, then data.

				Client.Get(`https://api.roblox.com/users/get-by-username/?username=${Id}`)
					.then(IdData => {
						let Id = IdData.Id

						//  Now we get the stuff as usual
						Client.Get(`https://users.roblox.com/v1/users/${Id}`)
							.then(UserData => {
								this.Id = Id
								this.Username = UserData.displayName
								this.Joined = new Date(UserData.created)
								this.Banned = UserData.isBanned
								this.Bio = UserData.description
								Resolve()
							})
							.catch(Err => {
								if (Err) Reject(Err)
							})
					})
					.catch(Err => {
						if (Err) Reject(Err)
					})

				break
			case "number":

				//  Provided is an ID
				//  Grab user data

				Client.Get(`https://users.roblox.com/v1/users/${Id}`)
					.then(UserData => {
						this.Id = Id
						this.Username = UserData.displayName
						this.Joined = new Date(UserData.created)
						this.Banned = UserData.isBanned
						this.Bio = UserData.description
						Resolve()
					})
					.catch(Err => {
						if (Err) Reject(Err)
					})
				break
			default:
				Reject("User: Invalid type provided for ID ("+typeof(Id)+")")
				break
			}

		})

	}

	IsFollowing() {
		return new Promise((Resolve,Reject) => {
			let OtherId = this.Id
			let ThisId = this.Client.Id
			this.Client.Get(`https://api.roblox.com/user/following-exists/?followerUserId=${ThisId}&userId=${OtherId}`)
				.then(FollowData => {
					if(FollowData.success) {
						Resolve(FollowData.isFollowing)
					} else {
						Reject(FollowData.message)
					}
				})
				.catch(Err => {
					Reject(Err)
				})
                
		})
	}

	SetFollowing(To) {



		return new Promise((Resolve,Reject) => {
			let OtherId = this.Id
			console.log(OtherId,this.Client.Id)

			switch(To){
			case true:
				this.Client.Post(
					`https://friends.roblox.com/v1/users/${OtherId}/follow`,
					undefined,
					true,
				)
					.then((Message) => {
						console.log(Message)
						if (Message.success) {
							Resolve()
						} else {
							Reject(Message.errors[0].message)
						}
					})
					.catch((Err) => {
						if (Err) Reject("User-Follow" + Err)
					})
				break
			case false:
				this.Client.Post(`https://friends.roblox.com/v1/users/${OtherId}/unfollow`)
					.then(() => {
						//  Message, as of late, is empty.
						Resolve()
					})
					.catch(Err => {
						if (Err) Reject(Err)
					})
				break
			default:
				Reject("SetFollowing: Arg 2 is not supplied or is not resolvable to a true/false boolean.")
			}
                
		})

	}

	SendMessage(Subject, Body) {
        
		return new Promise((Resolve, Reject) => {
            
			let Id = this.Id

			let Content = {
				subject: String(Subject),
				body: String(Body),
				recipientId: Number(Id),
				includePreviousMessage: false,
			}

			this.Client.Post("https://privatemessages.roblox.com/v1/messages/send", Content)
				.then(Response => {
					if (Response.success) {
						Resolve()
					} else {
						Reject(`Error sending message: [${Response.shortMessage}] ${Response.message}`)
					}
				})
				.catch(Err => {
					if (Err) Reject(Err)
				})
		})
	}
}