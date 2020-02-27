import express from 'express';
import tripsController from 'controllers/tripsController';
import checkUser from 'middlewares/checkUser';
import isUserManager from 'middlewares/isUserManager';
import isProfileUpdated from 'middlewares/isProfileUpdated';
import tripRequestValidator from 'middlewares/tripRequestValidator';
import dateValidator from 'middlewares/tripRequestDateValidator';
import { validateMultiCity, validateStops } from 'validation/multiCity.validation';
import validateParams from 'middlewares/paramsValidator';
import {
  isUuidParamValid, isTripExist, isTripAssigned, isTripRejected, isTripApproved
} from 'middlewares/validateRejectTrip';

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
router.post('/request', [checkUser, isProfileUpdated, dateValidator, tripRequestValidator], tripsController.createTrip);

/**
 * @swagger
 *
 * /api/v1/trips/multi-city:
 *   post:
 *     security: []
 *     summary: Multi city trip request
 *     description: Create a multi city trip request
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
 *               fromCountry:
 *                 type: string
 *               fromCity:
 *                 type: string
 *               toCountry:
 *                 type: string
 *               toCity:
 *                 type: string
 *               departureDate:
 *                 type: string
 *               stops:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     accommodation:
 *                       type: string
 *                     stopCountry:
 *                       type: string
 *                     stopCity:
 *                       type: string
 *                     arrivalDate:
 *                       type: string
 *                     departureDate:
 *                       type: string
 *                     reason:
 *                       type: string
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Your multi city trip request has been recorded.
 */
router.post('/multi-city', [checkUser, isProfileUpdated, validateMultiCity, validateStops], tripsController.multiCityTrip);
/**
 * @swagger
 *
 * /api/v1/trips/{tripId}/reject:
 *   put:
 *     security: []
 *     summary: Reject trip requests
 *     description: Reject Request (By Requester’s Manager)
 *     tags:
 *       - Trips
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
 *                  type: object
 *                  properties:
 *                   status:
 *                     type: integer
 *                   type:
 *                     type: string
 *                   from:
 *                     type: string
 *                   to:
 *                     type: string
 *                   reason:
 *                     type: string
 *                   accommodation:
 *                      type: string
 *                   departureDate:
 *                      type: string
 *                   returnDate:
 *                      type: string
 *                   stops:
 *                      type: array
 *     parameters:
 *          - name: tripId
 *            description: page number.
 *            in: path
 *            required: true
 *            default: 48e9bfdf-6d21-4fd8-8fc7-df654d615be1
 *            type: string
 *     responses:
 *       201:
 *         description: Trip request is successfuly rejected.
 */
router.put('/:tripId/reject', [checkUser, isProfileUpdated,
  isUserManager, isUuidParamValid, isTripExist, isTripAssigned, isTripRejected,
  isTripApproved],
tripsController.rejectTrip);

/**
 * @swagger
 *
 * /api/v1/trips/avail-requests?page={page}&limit={limit}:
 *   get:
 *     security: []
 *     summary: Avail request
 *     description: show all pending request to the manager for approval
 *     tags:
 *       - Trips
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *               message:
 *                 type: string
 *     parameters:
 *       - name: page
 *         description: page number.
 *         in: path
 *         required: false
 *         default: 1
 *         type: string
 *       - name: limit
 *         description: Requests per page.
 *         in: path
 *         required: false
 *         default: 5
 *         type: string
 *     responses:
 *       200:
 *         description: Pending requests retrieved successfully
 *  */
router.get('/avail-requests', checkUser, isProfileUpdated, validateParams, tripsController.availRequests);

/**
 * @swagger
 *
 * /api/v1/trips/request?page={page}&limit={limit}:
 *   get:
 *     security: []
 *     summary: Get trips
 *     description: G et trips
 *     tags:
 *       - Trips
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *               message:
 *                 type: string
 *     parameters:
 *       - name: page
 *         description: page number.
 *         in: path
 *         required: false
 *         default: 1
 *         type: string
 *       - name: limit
 *         description: limited items.
 *         in: path
 *         required: false
 *         default: 5
 *         type: string
 *     responses:
 *       200:
 *         description: Requests retrieved successfully
 *  */
router.get('/request', checkUser, isProfileUpdated, validateParams, tripsController.getTrips);

/**
 * @swagger
 *
 * /api/v1/trips/search?page={page}&limit={limit}:
 *   get:
 *     security: []
 *     summary: Search trips
 *     description: Search trips
 *     tags:
 *       - Trips
*     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchKey:
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
 *     parameters:
 *       - name: page
 *         description: page number.
 *         in: path
 *         required: false
 *         default: 1
 *         type: string
 *       - name: limit
 *         description: limited items.
 *         in: path
 *         required: false
 *         default: 5
 *         type: string
 *     responses:
 *       200:
 *         description: Requests retrieved successfully
 *  */
router.get('/search', checkUser, isProfileUpdated, validateParams, tripsController.searchTrips);
export default router;
