import { Router } from 'express';
import isLoggedIn from '../../utils/isLoggedIn';

const router = Router();

/**
 * @swagger
 *
 * /api/v1:
 *  get:
 *   description: Welcome message for users
 *   tags:
 *     - Default
 *   responses:
 *     '200':
 *       description: 'Welcome to Barefoot Nomad'
 */
router.get('/', isLoggedIn);


export default router;
