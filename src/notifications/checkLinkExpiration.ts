import {APIGatewayProxyHandler} from "aws-lambda";
import notificationService from "../service/notificationService";
import HttpError from "../exceptions/HttpError";

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    try {
        await notificationService.checkLinksExpiration()
        return {
            statusCode: 200,
            body: JSON.stringify({message:'Event processed successfully'}),
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