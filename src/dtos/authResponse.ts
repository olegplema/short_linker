

export default class AuthResponse {
    public email:string
    public accessToken:string
    public refreshToken:string

    constructor(email:string,accessToken:string, refreshToken:string) {
        this.email = email
        this.accessToken = accessToken
        this.refreshToken = refreshToken
    }
}