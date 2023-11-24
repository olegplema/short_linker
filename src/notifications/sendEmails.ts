import {SQSEvent} from "aws-lambda";
import ISqsMessage from "../types/ISqsMessage";
import notificationService from "../service/notificationService";
import HttpError from "../exceptions/HttpError";


export const handler = async (event: SQSEvent, _context: any): Promise<any> => {
    try {
        for (const record of event.Records) {
            const message = JSON.parse(record.body) as ISqsMessage
            console.log("SES is working")
            console.log("SES message " + message.email)
            await notificationService.sendEmail('Link Expired', message)
            await notificationService.deleteSqsMessage(record.receiptHandle)
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Emails sent successfully' }),
        }
    } catch (error) {
        if (error instanceof HttpError) {
            console.error('HttpError:', error)
            return {
                statusCode: error.status,
                body: JSON.stringify({ message: error.message }),
            }
        } else {
            console.error('Error:', error)
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Internal Server Error' }),
            }
        }
    }
}