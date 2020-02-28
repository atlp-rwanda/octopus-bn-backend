import express from 'express';
import checkUser from 'middlewares/checkUser';
import isTravelAdministrator from 'middlewares/isTravelAdministrator';
import isProfileUpdated from 'middlewares/isProfileUpdated';
import accommodationController from '../../controllers/accommodation';
import accommodationValidator from '../../middlewares/accommodationValidator';
import roomsValidator from '../../middlewares/roomsValidator';
import validateAccommodationAndRoom from '../../middlewares/validateAccommodationAndRoom';

const router = express.Router();

/**
 * @swagger
 *
 * /api/v1/accommodations:
 *   post:
 *     security: []
 *     summary: add accommodations
 *     description: add accommodations
 *     tags:
 *       - Accommodations
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               around:
 *                 type: array
 *                 items:
 *                   type: string
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               amenities:
 *                 type: array
 *               around:
 *                 type: array
 *     responses:
 *       201:
 *         description: Accommodation Created successfully
 */
router.post('/', [checkUser, isProfileUpdated, isTravelAdministrator, accommodationValidator], accommodationController.create);
/**
 * @swagger
 *
 * /api/v1/accommodations/room:
 *   post:
 *     security: []
 *     summary: add accommodations
 *     description: add accommodations
 *     tags:
 *       - Accommodations
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accommodationsID:
 *                 type: string
 *               roomNumber:
 *                 type: string
 *               cost:
 *                 type: number
 *               currency:
 *                 type: string
 *               type:
 *                 type: string
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accommodationsID:
 *                 type: string
 *               roomNumber:
 *                 type: string
 *               cost:
 *                 type: string
 *               currency:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Room added successfully
 */
router.post('/room', [checkUser, isProfileUpdated, isTravelAdministrator, roomsValidator, validateAccommodationAndRoom], accommodationController.addRoom);
export default router;
