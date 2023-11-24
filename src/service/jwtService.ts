import jwt from "jsonwebtoken";
import ITokens from "../types/ITokens";
import ITokenPayload from "../types/ITokenPayload";


class JwtService {
    generateTokens(payload: ITokenPayload): ITokens{
        console.log("enviroment abc " + process.env.ACCESS_TOKEN_SECRET!)
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!,{expiresIn: '60m'})
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!,{})
        return {accessToken,refreshToken}
    }

    validateAccessToken(accessToken:string): ITokenPayload|null{
        try{
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as ITokenPayload
            return decoded
        }catch (e) {
            return null
        }
    }

    validateRefreshToken(refreshToken:string): ITokenPayload|null{
        try{
            const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET!) as ITokenPayload
            return decoded
        }catch (e) {
            return null
        }
    }
}

export default new JwtService()