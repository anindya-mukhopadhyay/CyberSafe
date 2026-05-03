import { Router } from 'express';
import {
  createReport,
  getAdminOverview,
  getAllReports,
  getMyReports,
  updateReportStatus,
} from '../controllers/reportController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { uploadEvidence } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/', protect, uploadEvidence.array('evidenceFiles', 5), createReport);
router.get('/my', protect, getMyReports);
router.get('/overview', protect, adminOnly, getAdminOverview);
router.get('/', protect, adminOnly, getAllReports);
router.patch('/:id/status', protect, adminOnly, updateReportStatus);

export default router;
