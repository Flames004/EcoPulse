import { Router } from 'express';
import {
  addDevice,
  getAllDevices,
  getElectronicsStats,
  updateDevice,
  deleteDevice,
} from '../controllers/electronics.controller';

const router = Router();

router.post('/', addDevice);
router.get('/', getAllDevices);
router.get('/stats', getElectronicsStats);
router.put('/:id', updateDevice);
router.delete('/:id', deleteDevice);

export default router;
