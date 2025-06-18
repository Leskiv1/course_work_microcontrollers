import User from '../models/user.model.js';
import Detail from '../models/tripDetail.model.js';
import Trip from "../models/trip.model.js";
import UserService from './user.service.js';

class DetailService {
    static async writeNewData(userId, data) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User was not found');
        }

        const activeTrip = await UserService.getActiveTrip(user.id);
        if (!activeTrip) {
            throw new Error('User does not have an active trip');
        }

        if (!data.location?.latitude || !data.location?.longitude) {
            throw new Error('Missing required fields');
        }

        const recordedAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

        return await Detail.create({
            trip_id: activeTrip.id,
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            speed: data.speed?.kmph ?? null,
            tilt_angle: data.tilt_angle ?? null,
            battery_percent: data.battery_percent ?? null,
            recorded_at: recordedAt,
        });
    }

    static async getTripsDetails() {
        const data = await Detail.findAll({
            include: [
                {
                    model: Trip,
                    include: [
                        {
                            model: User,
                            attributes: ['id'],
                        },
                    ],
                },
            ],
        });

        return data.map(detail => detail.toJSON());
    }


    static async getTripDetailsById(tripId) {
        const tripDetails = await Detail.findAll({
            where: {
                trip_id: tripId,
            },
            order: [['recorded_at', 'ASC']],
        })

        if (!tripDetails) {
            throw new Error('Trip details not found');
        }

        return tripDetails.map(detail => detail.toJSON());
    }
}

export default DetailService;
