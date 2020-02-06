import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';
import swaggerOptions from '../../utils/api-specifications';
import welcomeRoute from './welcome';

const router = Router();
const swaggerDoc = swaggerJsdoc(swaggerOptions);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
router.use('/api/v1', welcomeRoute);

export default router;
