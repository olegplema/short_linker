import jwtService from '../service/jwtService';
import { APIGatewayAuthorizerHandler } from 'aws-lambda';
import HttpError from "../exceptions/HttpError";

export const handler: APIGatewayAuthorizerHandler = async (
    event,
    _context
) => {
    try {
        const authorization = event.authorizationToken
        console.log("Token " + authorization)
        const token = authorization.split(' ')[1]
        const decoded = jwtService.validateAccessToken(token)
        if (!decoded) {
            throw HttpError.UnauthorizedError('Unauthorized')
        }

        const userId = decoded.id

        return {
            principalId: userId,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Action: 'execute-api:*',
                        Resource: event.methodArn,
                    },
                ],
            },
            context:{userId}
        }
    } catch (err) {
        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Deny',
                        Action: 'execute-api:*',
                        Resource: event.methodArn,
                    },
                ],
            },
        }
    }
}
