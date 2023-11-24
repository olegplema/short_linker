import {APIGatewayProxyHandler} from "aws-lambda";
import linkService from "../service/linkService";
import IContext from "../types/IContext";
import HttpError from "../exceptions/HttpError";


export const handler: APIGatewayProxyHandler = async (event, _context) => {
    try {
        const {id} = JSON.parse(event.body!)
        const userId = event.requestContext?.authorizer?.userId
        await linkService.deactivate(id, userId)
        return {
            statusCode: 200,
            body: JSON.stringify({message:'Link deactivated'}),
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