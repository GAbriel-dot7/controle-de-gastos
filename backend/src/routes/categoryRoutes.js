import express from 'express';
import { list, create, update, remove } from '../controllers/categoryController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();
router.use(authenticate);
router.get('/', list);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
