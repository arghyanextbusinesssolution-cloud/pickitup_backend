import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { errorMiddleware } from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import { userRoutes } from './modules/users';
import { shipmentRoutes } from './modules/shipments';
import { carrierRoutes } from './modules/carriers';
import { bookingRoutes } from './modules/bookings';
import { reviewRoutes } from './modules/reviews';
import { bidRoutes } from './modules/bids';
import { paymentRoutes } from './modules/payments';
import { invoiceRoutes } from './modules/invoices';
import { adminRoutes } from './modules/admin';
import { disputeRoutes } from './modules/disputes';
import { cmsRoutes } from './modules/cms';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/carriers', carrierRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/cms', cmsRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorMiddleware);

export default app;
