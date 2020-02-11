import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';
import swaggerOptions from 'utils/api-specifications';
import welcomeRoute from './welcome';
import userRoutes from './user.routes';

const router = Router();
const swaggerDoc = swaggerJsdoc(swaggerOptions);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
router.use('/api/v1', welcomeRoute);
router.use('/api/v1/auth', userRoutes);

// set up auth routes v1
router.use('/api/v1/auth', userRoutes);

export default router;
