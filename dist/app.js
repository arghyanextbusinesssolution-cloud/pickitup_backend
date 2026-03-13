"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const users_1 = require("./modules/users");
const shipments_1 = require("./modules/shipments");
const carriers_1 = require("./modules/carriers");
const bookings_1 = require("./modules/bookings");
const reviews_1 = require("./modules/reviews");
const bids_1 = require("./modules/bids");
const payments_1 = require("./modules/payments");
const invoices_1 = require("./modules/invoices");
const admin_1 = require("./modules/admin");
const disputes_1 = require("./modules/disputes");
const cms_1 = require("./modules/cms");
const app = (0, express_1.default)();
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', users_1.userRoutes);
app.use('/api/shipments', shipments_1.shipmentRoutes);
app.use('/api/carriers', carriers_1.carrierRoutes);
app.use('/api/bookings', bookings_1.bookingRoutes);
app.use('/api/reviews', reviews_1.reviewRoutes);
app.use('/api/bids', bids_1.bidRoutes);
app.use('/api/payments', payments_1.paymentRoutes);
app.use('/api/invoices', invoices_1.invoiceRoutes);
app.use('/api/admin', admin_1.adminRoutes);
app.use('/api/disputes', disputes_1.disputeRoutes);
app.use('/api/cms', cms_1.cmsRoutes);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Error handling
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
