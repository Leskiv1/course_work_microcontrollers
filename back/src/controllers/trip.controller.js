import TripService from "../services/trip.service.js";

class TripController {
    static async startNewTrip(req, res) {
        const userId = req.params.id;

        try {
            const trip = await TripService.startNewTrip(userId);
            res.status(201).json({
                message: 'Trip started successfully',
                tripId: trip.id,
            });
        } catch (error) {
            console.error('Error starting trip:', error);

            if (error.message === 'User already has an active trip') {
                res.status(409).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Failed to start trip' });
            }
        }
    }

    static async stopTrip(req, res) {
        const userId = req.params.id;

        try {
            const trip = await TripService.stopTrip(userId);
            res.status(201).json({
                message: 'Trip stopped successfully',
                tripId: trip.id,
            })
        } catch (error) {
            console.error('Error stopping trip:', error);

            if (error.message === 'User was not found') {
                res.status(404).json({ error: error.message });
            } else if (error.message === 'Not enough trip data to calculate statistics') {
                res.status(404).json({ error: error.message });
            } else if (error.message === 'Error adding statistic') {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Failed to stop trip' });
            }
        }
    }

    static async getFinishedTrips(req, res) {
        try {
            const data = await TripService.getFinishedTrips();
            res.status(201).json(data);
        } catch (e) {
            console.error('Error getting trips:', e);
            res.status(404).json({ error: e });
        }
    }

    static async getCurrentTrips(req, res) {
        try {
            const data = await TripService.getCurrentTrips();
            res.status(200).json((JSON.stringify(data, null, 2)));
        } catch (e) {
            console.error('Error getting trips:', e);
            res.status(404).json({ error: e });
        }
    }

    static async getTripStatistic(req, res) {
        const id = Number(req.params.id);

        try {
            const data = await TripService.getTripStatistic(id);
            res.status(200).json(data);
        } catch (e) {
            console.error('Error getting trip statistic:', e);
            res.status(404).json({ error: e });
        }
    }
}

export default TripController;