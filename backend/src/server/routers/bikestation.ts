import express from 'express';
import BikeStationController from '../../bike_stations/BikeStationController';
import { requirePageRequest } from '../middleware/requirepagerequest';
import { requireNumberIdParam } from '../middleware/requirenumberidparam';

const router = express.Router();

router.get('/page', requirePageRequest, BikeStationController.page);
router.get('/:id', requireNumberIdParam, BikeStationController.findOneById);

export default router;
