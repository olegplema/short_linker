import Aws from "aws-sdk";


export default class User {

    constructor(public id:string,
                public email:string,
                public password:string,
                public refreshToken:string) {}

}