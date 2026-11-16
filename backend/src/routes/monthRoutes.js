import express from 'express';
import { list, close, reopen } from '../controllers/monthController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();
router.use(authenticate);
router.get('/', list);
router.post('/close', close);
router.delete('/:year/:month', reopen);

export default router;
