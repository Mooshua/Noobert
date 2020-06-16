const Promise = require("promise")

module.exports = class Group {

	constructor(Client,Id) {
		this.Client = Client
		this.Id = Id

		//  Get names and all that good s***
		this.Ready = new Promise((Resolve,Reject) => {
			this.Client.Get(`https://groups.roblox.com/v1/groups/${Id}`)
				.then(GroupData => {
					this.Name = GroupData.name
					this.Desc = GroupData.description

					this.OwnerData = !!GroupData.owner && {
						Id: GroupData.owner.userId,
						Name: GroupData.owner.displayName
					}

					this.ShoutData = !!GroupData.shout && {
						Body: this.GroupData.shout.body,
						Time: new Date(this.GroupData.shout.updated)

					}

					this.Members = GroupData.memberCount
					this.Public = GroupData.publicEntryAllowed
                    
					Resolve()
				})
				.catch(Err => {
					if (Err) Reject(Err)
				})
		})
	}
}