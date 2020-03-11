import uuid from 'uuid/v4';
import Models from 'database/models';

const { Accomodations, AcommodationLikesAndUnlikes } = Models;

class accomodationService {
    static async CheckIfLiked(userId, accommodationId) {
        const liked = await AcommodationLikesAndUnlikes.findOne({ where: { userId, accommodationId, } });
        return liked;
    }
    static async findLikes(accommodationId, like) {
        const liked = await AcommodationLikesAndUnlikes.findAll({ where: { accommodationId, like } });
        return liked;
    }
    static async findAccomodation(accommodationId) {
        const isAccomodation = await Accomodations.findOne({ where: {id: accommodationId }})
        return isAccomodation;
    }
    static async UpdateLikeStatus(userId, accommodationId, action){
        const updated = await AcommodationLikesAndUnlikes.update(
            { liked: action },
            { where: {  userId, accommodationId, } });
        return updated;
    }
    static async createlike(like){
        const newLike = await AcommodationLikesAndUnlikes.create(like)
    }
}
export default accomodationService;