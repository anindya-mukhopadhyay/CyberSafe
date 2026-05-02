import { Router } from 'express';
import { checkPhishingUrl } from '../controllers/phishingController.js';

const router = Router();

router.post('/check-url', checkPhishingUrl);

export default router;
