import express from 'express';
import { index, remove } from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();
router.use(authenticate);
router.get('/', authorize('ADMIN'), index);
router.delete('/:id', authorize('ADMIN'), remove);

export default router;
