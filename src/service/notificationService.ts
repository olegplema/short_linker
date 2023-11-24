import Aws from "aws-sdk";
import linkService from "./linkService";
import userRepo from "../db/userRepo";
import ISqsMessage from "../types/ISqsMessage";
import { SES } from 'aws-sdk';
import linkRepo from "../db/linkRepo";


class NotificationService {

    private sqs = new Aws.SQS()
    private ses = new Aws.SES({ region: process.env.REGION });
    constructor() {
        Aws.config.update({
            region:process.env.REGION,
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        })
    }

    public async deleteSqsMessage(receiptHandle: string): Promise<void> {
        const deleteParams: Aws.SQS.DeleteMessageRequest = {
            QueueUrl: process.env.QUEUE_URL!,
            ReceiptHandle: receiptHandle,
        }

        await this.sqs.deleteMessage(deleteParams).promise()
    }

    private async sendSqsMessage(message:ISqsMessage) {
        const param = {
            MessageBody:JSON.stringify({email:message.email, link:message.link}),
            QueueUrl:process.env.QUEUE_URL!,
        }

        this.sqs.sendMessage(param,(err, data) => {
            if (err) {
                console.log("SQS error " + err)
                throw err
            } else {
                console.log("SQS ID" + data.MessageId);
            }
        })
    }

    public async checkLinksExpiration(){
        const links = await linkRepo.getAll()
        if (links){
            for (const item of links) {
                const isNotExpired = await linkService.deactivateExpired(item)
                // console.log(!isNotExpired)
                if (!isNotExpired) {
                    const user = await userRepo.findUserById(item.userId)
                    await this.sendSqsMessage({ email: user.email, link: item })
                }
            }
        }
    }

    public async sendEmail(subject:string, message: ISqsMessage){
        console.log("EMAIL " + process.env.EMAIL)
        const params: SES.SendEmailRequest = {
            Destination: {
                ToAddresses: [message.email],
            },
            Message: {
                Body: {
                    Text: {
                        Data: message.link.id + ' has been expired',
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
            Source: process.env.EMAIL!,
        }
        await this.ses.sendEmail(params, (err, data) => {
            if (err){
                console.log("SES error " + err)
            }else {
                console.log("EMAIL SENT " + data.MessageId)
            }
        })
    }
}

export default new NotificationService()