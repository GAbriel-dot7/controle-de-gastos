import express from 'express';
import { list, getOne, create, update, remove, updateStatus, summary } from '../controllers/expenseController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();
router.use(authenticate);
router.get('/', list);
router.get('/summary', summary);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.patch('/:id/status', updateStatus);
router.delete('/:id', remove);

export default router;
