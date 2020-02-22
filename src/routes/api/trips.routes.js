import express from 'express';
import tripsController from 'controllers/tripsController';
import checkUser from 'middlewares/checkUser';
import tripRequestValidator from 'middlewares/tripRequestValidator';
import validateMultiCity from 'validation/multiCity.validation';
import dateValidator from 'middlewares/tripRequestDateValidator';

const router = express.Router();

/**
 * @swagger
 *
 * /api/v1/trips/request:
 *   post:
 *     security: []
 *     summary: trip requests
 *     description: trip requests
 *     tags:
 *       - Trips
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               passportNumber:
 *                 type: string
 *               gender:
 *                 type: string
 *               fromCountry:
 *                 type: string
 *               fromCity:
 *                 type: string
 *               toCountry:
 *                 type: string
 *               toCity:
 *                 type: string
 *               accommodation:
 *                 type: string
 *               departureDate:
 *                 type: string
 *               reason:
 *                 type: string
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *               message:
 *                 type: string
 *               data:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: integer
 *                   passportNumber:
 *                     type: string
 *                   from:
 *                     type: string
 *                   to:
 *                     type: string
 *                   reason:
 *                     type: string
 *     responses:
 *       201:
 *         description: Travel request successfully created
 */
router.post('/request', [checkUser, dateValidator, tripRequestValidator], tripsController.createTrip);

/**
 * @swagger
 *
 * /api/v1/trips/multi-city:
 *   post:
 *     security: []
 *     summary: Multi city trip request
 *     description: trip requests
 *     tags:
 *       - Trips
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                 passportNumber:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 fromCountry:
 *                   type: string
 *                 fromCity:
 *                   type: string
 *                 toCountry:
 *                   type: string
 *                 toCity:
 *                   type: string
 *                 accommodation:
 *                   type: string
 *                 departureDate:
 *                   type: string
 *                 reason:
 *                   type: string
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *               message:
 *                 type: string
 *               data:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: integer
 *                   passportNumber:
 *                     type: string
 *                   from:
 *                     type: string
 *                   to:
 *                     type: string
 *                   reason:
 *                     type: string
 *     responses:
 *       201:
 *         description: Travel request successfully created
 */
router.post('/multi-city', validateMultiCity, checkUser, tripsController.createMultiCityTrip);

export default router;
