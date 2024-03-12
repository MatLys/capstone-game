import { MessageTool } from './MessageTool';

export async function POST(request:Request) {

    var number = "", message="";
    await request.json().then(data => {number = data.number; message=data.message;});

    const messageTool = new MessageTool(
        (process.env.TWILIO_ACCOUNT_SID)?process.env.TWILIO_ACCOUNT_SID:"",
        (process.env.TWILIO_AUTH_TOKEN)?process.env.TWILIO_AUTH_TOKEN:"",
        (process.env.TWILIO_NUMBER)?process.env.TWILIO_NUMBER:"");
    messageTool.sendMessage(number, message);

    return Response.json({body: "number called: " + number + "; message: " + message});
}