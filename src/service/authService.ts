import AuthResponse from "../dtos/authResponse";
import jwt from "jsonwebtoken"
import userRepo from "../db/userRepo";
import jwtService from "./jwtService";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import User from "../db/models/User";
import HttpError from "../exceptions/HttpError";

class AuthService {

    async signIn(email:string, password:string) : Promise<AuthResponse>{
        const foundUser = await userRepo.findUserByEmail(email)

        if (!foundUser){
            throw HttpError.NotFoundError('User does not exists')
        }

        const isPassword = bcrypt.compareSync(password, foundUser.password)

        if (!isPassword){
            throw HttpError.UnauthorizedError('Password is wrong')
        }

        const {accessToken, refreshToken} =
            jwtService.generateTokens({id: foundUser.id, email:foundUser.email})

        await userRepo.updateRefreshToken(foundUser.id, refreshToken)

        return new AuthResponse(foundUser.email, accessToken, refreshToken)
    }

    async signUp(email:string, password:string) : Promise<AuthResponse>{
        const foundUser = await userRepo.findUserByEmail(email)

        if (foundUser){
            throw HttpError.ConflictError('This user already exists')
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const id = uuidv4()
        const {accessToken, refreshToken} =
            jwtService.generateTokens({id, email})

        const user = new User(id, email, hashedPassword, refreshToken)
        await userRepo.save(user)

        return new AuthResponse(user.email, accessToken, refreshToken)
    }

    public async refresh(token:string): Promise<AuthResponse>{
        const decoded = jwtService.validateRefreshToken(token)

        if(!decoded){
            throw HttpError.UnauthorizedError('Unauthorized')
        }

        const user = await userRepo.findUserByEmail(decoded.email)

        if (!user || token !== user.refreshToken){
            throw HttpError.UnauthorizedError('Unauthorized')
        }

        const {accessToken, refreshToken} =
            jwtService.generateTokens({id: user.id, email:user.email})
        await userRepo.updateRefreshToken(user.id, refreshToken)

        return new AuthResponse(user.email, accessToken, refreshToken)
    }
}

export default new AuthService()