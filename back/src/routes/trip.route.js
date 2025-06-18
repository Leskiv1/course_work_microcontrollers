import {Router} from "express";
import TripController from "../controllers/trip.controller.js";

const router = Router();

router.post('/start/:id', TripController.startNewTrip);
router.put('/stop/:id', TripController.stopTrip);
router.get('/finished', TripController.getFinishedTrips);
router.get("/statistic/:id", TripController.getTripStatistic);
router.get("/current", TripController.getCurrentTrips);

export default router;