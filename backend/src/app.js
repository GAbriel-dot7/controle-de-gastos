import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import monthRoutes from './routes/monthRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { env } from './config/env.js';

const app = express();
const allowedOrigins = Array.from(new Set([env.corsOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'].filter(Boolean)));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origem CORS não permitida.'));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API funcionando.' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API funcionando.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/months', monthRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint não encontrado.' });
});

app.use(errorHandler);

export default app;
