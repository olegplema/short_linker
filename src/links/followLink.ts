import {APIGatewayProxyHandler} from "aws-lambda";
import linkService from "../service/linkService";
import HttpError from "../exceptions/HttpError";


export const handler: APIGatewayProxyHandler = async (event, _context) => {
    try {
        const {id} = event.pathParameters
        const link = await linkService.getOriginalLink(id!)
        return {
            statusCode: 302,
            headers: {
                Location: link,
            },
            body: '',
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
