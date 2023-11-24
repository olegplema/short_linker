import expiresInEnum from "../db/expiresInEnum";
import ShortUniqueId from "short-unique-id";
import Link from "../db/models/Link";
import linkRepo from "../db/linkRepo";
import HttpError from "../exceptions/HttpError";


class LinkService {

    private convertToEnum(val: string):expiresInEnum{
        if (val === 'ONE_TIME')
            return expiresInEnum.ONE_TIME
        if (val === '1d')
            return expiresInEnum.ONE_DAY
        if (val === '3d')
            return expiresInEnum.THREE_DAYS
        if (val === '7d')
            return expiresInEnum.SEVEN_DAYS
        if (val === '30s')
            return expiresInEnum.THIRTY_SECONDS
        throw HttpError.BadRequestError('No such option')
    }

    public async createLink(userId:string,link:string, expiresIn:string):Promise<string>{
        const uid = new ShortUniqueId({length:6})
        const id = uid.rnd()
        const linkObj = new Link(id, link, this.convertToEnum(expiresIn), userId, new Date().getTime(), true)
        await linkRepo.save(linkObj)
        return id
    }

    public async deactivateExpired(link: Link):Promise<boolean>{
        if(link.expiresIn === expiresInEnum.ONE_TIME){
            return true
        }
        if (!link.isActive){
            return true
        }
        const expirationTimeInMilliseconds = link.expiresIn * 24 * 60 * 60 * 1000
        const elapsedTime = new Date().getTime() - link.createdAt
        console.log("elapsedTime " + elapsedTime + " expirationTimeInMilliseconds " + expirationTimeInMilliseconds)
        if (elapsedTime > expirationTimeInMilliseconds){
            await linkRepo.updateIsActive(link.id, false)
            return false
        }
        return true
    }

    public async deactivate(id:string, userId:string):Promise<void>{
        const link = await linkRepo.findLinkById(id)
        if (link.userId !== userId){
            throw HttpError.ForbiddenError("You do not have permission to deactivate this link")
        }
        await linkRepo.updateIsActive(id, false)
    }

    public async userLinks(userId:string){
        const links = await linkRepo.findAllByUserId(userId)
        return links
    }

    public async getOriginalLink(id:string):Promise<string>{
        const link = await linkRepo.findLinkById(id)
        if (!link.isActive){
            throw HttpError.NotFoundError('Link is not active')
        }
        if (link.expiresIn === expiresInEnum.ONE_TIME){
            await linkRepo.updateIsActive(link.id,false)
        }
        await linkRepo.setTransitionCount(id, link.transitionCount + 1)
        return link.link
    }
}


export default new LinkService()