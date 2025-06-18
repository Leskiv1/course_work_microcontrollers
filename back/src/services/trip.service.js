import Trip from '../models/trip.model.js';
import User from '../models/user.model.js';
import Detail from '../models/tripDetail.model.js';
import TripStatistic from "../models/tripStatistic.model.js";
import UserService from './user.service.js';
import DetailService from "./detail.service.js";
import {distanceMeters} from "../utils/utils.js";

class TripService {
    static async startNewTrip(userId) {
        const user = await UserService.findOrCreateUser(userId);

        const activeTrip = await UserService.getActiveTrip(user.id);
        if (activeTrip) {
            throw new Error('User already has an active trip');
        }

        user.is_riding = true;
        await user.save();

        return await Trip.create({
            user_id: user.id,
            is_finished: false,
        });
    }

    static async stopTrip(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User was not found');
        }

        const activeTrip = await UserService.getActiveTrip(user.id);
        if (!activeTrip) {
            throw new Error('Error while trying to stop trip');
        }

        const details = await DetailService.getTripDetailsById(activeTrip.id);
        if (!details || details.length < 2) {
            throw new Error('Not enough trip data to calculate statistics');
        }

        let distance = 0;
        for (let i = 1; i < details.length; i++) {
            distance += distanceMeters(
                details[i - 1].latitude, details[i - 1].longitude,
                details[i].latitude, details[i].longitude
            ) / 1000;
        }

        const startDate = new Date(details[0].recorded_at);
        const finishDate = new Date(details[details.length - 1].recorded_at);
        const durationHr = (finishDate - startDate) / (1000 * 60 * 60);

        const avgSpeed = durationHr > 0 ? distance / durationHr : 0;

        const total = details.length;
        const upCount = details.filter(d => d.tilt_angle > 20).length;
        const downCount = details.filter(d => d.tilt_angle < -20).length;
        const percentageUp = (upCount / total) * 100;
        const percentageDown = (downCount / total) * 100;

        const addedItem = await TripStatistic.create({
            trip_id: activeTrip.id,
            distance_km: distance,
            duration_hr: durationHr,
            start_date: startDate,
            finish_date: finishDate,
            avg_speed: avgSpeed,
            percentage_up: percentageUp,
            percentage_down: percentageDown,
        });

        if (!addedItem) {
            throw new Error('Error adding statistic');
        }

        activeTrip.is_finished = true;
        await activeTrip.save();

        user.is_riding = false;
        await user.save();

        return activeTrip;
    }

    static async getFinishedTrips() {
        const trips = await Trip.findAll({
            where: { is_finished: true },
            include: [
                {
                    model: Detail,
                    separate: true,
                    limit: 1,
                    order: [['recorded_at', 'ASC']],
                    attributes: ['recorded_at'],
                },
                {
                    model: User,
                    attributes: ['id'],
                }
            ],
        });

        return trips.map(trip => {
            const startTime = trip.TripDetails?.[0]?.recorded_at || null;
            return {
                id: trip.id,
                user_id: trip.User.id,
                is_finished: trip.is_finished,
                started_at: startTime,
            };
        });
    }

    static async getTripStatistic(tripId) {
        const trip = await TripStatistic.findByPk(tripId);
        if (!trip) {
            throw new Error('Trip statistic not found');
        }
        return trip.toJSON();
    }

    static async getCurrentTrips() {
        const trips = await Trip.findAll({
            where: { is_finished: false },
            include: [
                {
                    model: Detail,
                    attributes: ['recorded_at', 'latitude', 'longitude', 'speed', 'tilt_angle'], // include all needed fields
                },
                {
                    model: User,
                    attributes: ['id'],
                }
            ],
        });

        return trips.map(trip => {
            // Sort details by time
            const sortedDetails = trip.TripDetails?.sort(
                (a, b) => new Date(a.recorded_at) - new Date(b.recorded_at)
            ) || [];

            const startTime = sortedDetails[0]?.recorded_at || null;

            return {
                id: trip.id,
                user_id: trip.User.id,
                is_finished: trip.is_finished,
                started_at: startTime,
                details: sortedDetails,
            };
        });
    }
}

export default TripService;
