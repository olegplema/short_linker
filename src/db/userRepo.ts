import Aws from "aws-sdk";
import User from "./models/User";


class UserRepo{
    private docClient = new Aws.DynamoDB.DocumentClient()
    private tableName = 'Users'

    public async findUserByEmail(email:string):Promise<User>{
        const params = {
            TableName: this.tableName,
            FilterExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email,
            },
        };

        return new Promise((resolve, reject) => {
            this.docClient.scan(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    if (data.Items && data.Items.length > 0) {
                        const user = data.Items[0] as User;
                        resolve(user);
                    } else {
                        resolve(null)
                    }
                }
            })
        })
    }

    public async save(user:User):Promise<void>{
        const param = {
            TableName: this.tableName,
            Item: {...user}
        }
        return new Promise((resolve, reject) => this.docClient.put(param, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        }))
    }

    public async updateRefreshToken(id:string, refreshToken:string):Promise<void>{
        const param = {
            TableName: this.tableName,
            Key: {id},
            UpdateExpression: 'set refreshToken = :newRefreshToken',
            ExpressionAttributeValues: {
                ':newRefreshToken': refreshToken,
            },
            ReturnValues: 'ALL_NEW',
        }
        return new Promise((resolve, reject) => {
            this.docClient.update(param, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    public async findUserById(id:string): Promise<User>{
        const param = {
            TableName: this.tableName,
            Key: {id}
        }

        return new Promise((resolve, reject) => {
            this.docClient.get(param, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Item as User);
                }
            })
        })
    }
}

export default new UserRepo()