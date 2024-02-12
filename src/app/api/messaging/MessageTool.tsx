export class MessageTool {

    private accountSid:string;
    private authToken:string;
    private twilioNumber:string;

    constructor(accountSid:string, authToken:string, twilioNumber:string) {
        this.accountSid=accountSid;
        this.authToken=authToken;
        this.twilioNumber=twilioNumber;
    }

    sendMessage_fake(targ_number:string, message:string) {
        //...
    }

    sendMessage(targ_number: string, message:string) {
        const client = require('twilio')(this.accountSid, this.authToken);
        client.messages.create({
            body: message,
            from: this.twilioNumber,
            to: targ_number.trim()
        })
    }
}