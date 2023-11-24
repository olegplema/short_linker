import Link from "../db/models/Link";


export default interface ISqsMessage{
    email:string
    link:Link
}