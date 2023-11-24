import aws from "aws-sdk"

const dynamoDBConfig = {
    region:process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
}

const dynamoDb = new aws.DynamoDB(dynamoDBConfig)

export default dynamoDb