import express from 'express';
import BikeStationController from '../../bike_stations/BikeStationController';
import { requirePageRequest } from '../middleware/requirepagerequest';

const router = express.Router();

router.get('/page', requirePageRequest, BikeStationController.page);

export default router;
