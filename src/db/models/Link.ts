import ExpiresInEnum from "../expiresInEnum";


export default class Link {
    public transitionCount: number

    constructor(public id:string,
                public link:string,
                public expiresIn:ExpiresInEnum,
                public userId:string,
                public createdAt:number,
                public isActive:boolean,
                ) {
        this.transitionCount = 0
    }
}