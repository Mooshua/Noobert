
const Mongoose = require("Mongoose")
const Schema = Mongoose.Schema

let Guild = new Schema({

    //  Id of the guild
    Id: {
        type: Number,
        index: true,
    },

    //  Roblox groups associated with the guild.
    Groups: [{
        //  Roblox ID, and account .ROBLOSECURITY.
        Id: Number,
        Token: String,

        Name: String,
        Description: String,
        Thumbnail: String,

        Roles: [{

            //  Roles within the guild.
            //  Discord roles will match up to a roblox role. 
            Rank: Number,
            Name: String,
            RobloxId: Number,
            DiscordId: Number,

            Permissions: {
                //  A brief overview of the permissions that they can do
                //  Ex, set shouts, kick members, accept join requests, rank members.

                //  Permission to shout will also give permission to give announcements.
                Shout: Boolean,
                Kick: Boolean,
				AcceptJoinRequests: Boolean,
				Rank: Boolean,

				//	Manage can only be set by the owner of the group. Rank 255 has it by default.
				Manage: Boolean
            }

        }],

        Categories: [{
            
            //  Categories (ex, LR, MR, for different groups of people.)
            //  Specifies a list of roblox role-id's
            RobloxIds: [Number],
            //  Specifies a discord role to give them
            DiscordId: Number

        }],

        Shout: {
            //  We record this to see if it changes.
			Date: Date,
			//	Roblox number
            Author: Number,
			Body: String,
		},
	
	}],
	
	Announcements: {
		//	Categories. Ex: Developer announcements, HR updates, etc.
		Categories: [{
			Name: String,
			//	A role to ping in discord.
			Ping: {
				Enabled: Boolean,
				Role: Number,
            },
            //  The channels the announcement can be put in.
            Channel: [Number]
		}],
    }
    


})

let Roblox = new Schema({
    //  ROBLOX Id.
    Id: Number,

    //  Have they linked their discord?
    Discord: {
        Verified: Boolean,
        Discord: Number,
        Date: Date,
    },

    //  URL to thumbnail
    Thumbnail: String,
})

let Discord = new Schema({

    //  Discord snowflake
    Id: Number,

    Roblox: [{
        Roblox: Number,
        Date: Date,
    }]
})