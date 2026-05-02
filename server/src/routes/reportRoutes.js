import { Router } from 'express';
import {
  createReport,
  getAllReports,
  getMyReports,
  updateReportStatus,
} from '../controllers/reportController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, createReport);
router.get('/my', protect, getMyReports);
router.get('/', protect, adminOnly, getAllReports);
router.patch('/:id/status', protect, adminOnly, updateReportStatus);

export default router;
