import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import phishingRoutes from './routes/phishingRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'CyberSafe API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/phishing', phishingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
