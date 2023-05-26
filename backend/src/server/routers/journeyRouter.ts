import express from 'express';
import { requirePageRequest } from '../middleware/requirePageRequest';
import JourneyController from '../../journeys/JourneyController';

const router = express.Router();

router.get('/page', requirePageRequest, JourneyController.page);

export default router;
