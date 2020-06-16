//  Register.js
const { EventEmitter } = require('events')

/*
    The command register
    extremely simple.

    basically:
        - Use Register.on("CommandName") to register a command with CommandName
        - Use Register.alias("CN","CommandName") to quickly register a command's alias.
            - All requests given to an Alias should be emitted again for the original.
*/

class Register extends EventEmitter {

    constructor() {
        super()
    }
    
    alias(Quick, Full) {
        this.on(String(Quick), (Args,Raw) => {
            this.emit(String(Full), (Args,Raw))
        })
    }

}

module.exports = new Register()