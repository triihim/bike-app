import express from 'express';
import BikeStationController from '../../bike_stations/BikeStationController';
import { requirePageRequest } from '../middleware/requirePageRequest';
import { requireNumberIdParam } from '../middleware/requireNumberIdParam';

const router = express.Router();

router.get('/page', requirePageRequest, BikeStationController.page);
router.get('/:id/statistics', requireNumberIdParam, BikeStationController.stationStatistics);
router.get('/:id', requireNumberIdParam, BikeStationController.findOneById);

export default router;
