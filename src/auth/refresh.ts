import {APIGatewayProxyHandler} from "aws-lambda";
import authService from "../service/authService";
import HttpError from "../exceptions/HttpError";


export const handler: APIGatewayProxyHandler = async (event, _context) => {
    try {
        const { refreshToken } = JSON.parse(event.body!)
        const response = await authService.refresh(refreshToken)
        return {
            statusCode: 200,
            body: JSON.stringify(response),
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