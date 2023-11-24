import {Context} from "aws-lambda";


export default interface IContext extends Context{
    userId: string;
}

