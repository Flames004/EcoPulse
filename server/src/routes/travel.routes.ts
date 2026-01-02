import { Router } from 'express';
import {
  addTravel,
  getAllTravels,
  getTravelStats,
  deleteTravel,
} from '../controllers/travel.controller';

const router = Router();

router.post('/', addTravel);
router.get('/', getAllTravels);
router.get('/stats', getTravelStats);
router.delete('/:id', deleteTravel);

export default router;
