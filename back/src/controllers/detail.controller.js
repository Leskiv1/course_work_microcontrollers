import DetailService from "../services/detail.service.js";

class DetailController {
    static async addNewData(req, res) {
        const userId = req.params.id;
        const data = JSON.parse(req.body);

        if (data?.error) {
            console.log(data?.error);
            res.status(300).send({
                error: data?.error,
            })
        }

        try {
            const addedData = await DetailService.writeNewData(userId, data);
            res.status(201).json({
                message: 'Data added successfully',
            })
        } catch (error) {
            console.error('Error adding new data:', error);

            if (error.message === 'User was not found') {
                res.status(404).json({ error: error.message });
            } else if (error.message === 'User does not have an active trip') {
                res.status(409).json({ error: error.message });
            } else if (error.message === 'Missing required fields') {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Failed to add new data' });
            }
        }
    }

    static async getTripsDetails(req, res) {
        try {
            const data = await DetailService.getTripsDetails();
            res.status(200).json(data);
        } catch (error) {
            console.error('Error getting finished trips', error);
            res.status(404).json({ error: error.message });
        }
    }

    static async getTripDetailsById(req, res) {
        const tripId = Number(req.params.id);

        try {
            const data = await DetailService.getTripDetailsById(tripId);
            res.status(200).json(data);
        } catch (error) {
            console.error('Error getting finished trip details', error);
        }
    }
}

export default DetailController;