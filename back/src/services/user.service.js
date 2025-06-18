import User from '../models/user.model.js';
import Trip from '../models/trip.model.js';

class UserService {
    static async findOrCreateUser(userId) {
        let user = await User.findByPk(userId);
        if (!user) {
            user = await User.create({id: userId, is_riding: true});
        }
        return user;
    }

    static async getActiveTrip(userId) {
        return await Trip.findOne({
            where: {
                user_id: userId,
                is_finished: false,
            },
        });
    }
}

export default UserService;
