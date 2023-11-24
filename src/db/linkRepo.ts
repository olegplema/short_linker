import Aws from "aws-sdk";
import Link from "./models/Link";
import User from "./models/User";
import { AWSError } from 'aws-sdk/lib/error'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

class LinkRepo {
    private docClient = new Aws.DynamoDB.DocumentClient()
    private tableName = 'Links'

    async save(link:Link): Promise<void>{
        const param = {
            TableName: this.tableName,
            Item: {...link}
        }
        return new Promise((resolve, reject) => this.docClient.put(param, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        }))
    }

    async findLinkById(id:string): Promise<Link>{
        const param = {
            TableName: this.tableName,
            Key: {id}
        }

        return new Promise((resolve, reject) => {
            this.docClient.get(param, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Item as Link);
                }
            })
        })
    }

    async findAllByUserId(userId: string): Promise<Link[]> {
        const params = {
            TableName: this.tableName,
            FilterExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
        }

        return new Promise((resolve, reject) => {
            this.docClient.scan(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(data.Items)
                    resolve(data.Items as Link[]);
                }
            })
        })
    }

    public async updateIsActive(id:string, isActive:boolean){
        const param = {
            TableName: this.tableName,
            Key: {id},
            UpdateExpression: 'set isActive = :newIsActive',
            ExpressionAttributeValues: {
                ':newIsActive': isActive,
            },
            ReturnValues: 'ALL_NEW',
        }
        return new Promise((resolve, reject) => {
            this.docClient.update(param, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

    public getAll(): Promise<Link[]|null> {
        const scanParams = {
            TableName: this.tableName,
        }

        return new Promise((resolve, reject) => {
            this.docClient.scan(scanParams,async (err, data) => {
                if (err) {
                    reject(err)
                }
                if (data.Items && data.Items.length > 0) {
                    const links = data.Items as Link[]
                    resolve(links)
                } else {
                    resolve(null)
                }
            })
        })

    }

    public async setTransitionCount(id: string, transitionCount: number){
        const param = {
            TableName: this.tableName,
            Key: {id},
            UpdateExpression: 'set transitionCount = :newTransitionCount',
            ExpressionAttributeValues: {
                ':newTransitionCount': transitionCount,
            },
            ReturnValues: 'ALL_NEW',
        }
        return new Promise((resolve, reject) => {
            this.docClient.update(param, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

}

export default new LinkRepo()