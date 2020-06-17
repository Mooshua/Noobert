// eslint-disable-next-line no-unused-vars
const Promise = require("promise")
const User = require("./user")

/*
    **IMPORTANT DISTINCTION**

    This is for MEMBERs of a group with Member data (ex: ROLES.) Do not use this in the context of non-group users.
    This should be used to kick/rank members and the likes.
*/

module.exports = class Member extends User {

	constructor(Client,Group,Id) {
        super(Client, Id)
        
        //  Group should **NOT** be a number, but an initialized 
        this.Group = Group
	}
}