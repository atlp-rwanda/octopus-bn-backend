import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';
import swaggerOptions from 'utils/api-specifications';
import welcomeRoute from './welcome';
import userRoutes from './user.routes';
import tripsRouter from './trips.routes';
import accommodationRoutes from './accommodation.routes';
import notificationRoutes from './notification.routes';
import commentRoutes from './comment.routes';

const router = Router();
const swaggerDoc = swaggerJsdoc(swaggerOptions);
router.use('/', welcomeRoute);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// set up auth routes v1
router.use('/api/v1/auth', userRoutes);
router.use('/api/v1/trips', tripsRouter);
router.use('/api/v1/accommodations', accommodationRoutes);
router.use('/api/v1/notifications', notificationRoutes);
router.use('/api/v1/requests/comments', commentRoutes);

export default router;
