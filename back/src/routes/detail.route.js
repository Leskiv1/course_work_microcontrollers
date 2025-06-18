import {Router} from "express";
import DetailController from "../controllers/detail.controller.js";

const router = Router();

router.post('/:id', DetailController.addNewData);
router.get('/finished', DetailController.getTripsDetails);
router.get('/finished/:id', DetailController.getTripDetailsById);

export default router;