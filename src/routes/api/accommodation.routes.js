import express from 'express';
import checkUser from 'middlewares/checkUser';
import isTravelAdministrator from 'middlewares/isTravelAdministrator';
import isProfileUpdated from 'middlewares/isProfileUpdated';
import validateParams from 'middlewares/paramsValidator';
import accommodationController from '../../controllers/accommodation';
import accommodationValidator from '../../middlewares/accommodationValidator';
import roomsValidator from '../../middlewares/roomsValidator';
import validateAccommodationAndRoom from '../../middlewares/validateAccommodationAndRoom';
import {
  isAccomendationExist, isRoomExist, isTripExist,
  checkInAndCheckoutValidator, isRoomAlreadyBooked,
  areYouTripOwner
} from '../../middlewares/validateBooking';
import validateId from '../../middlewares/idValidator';
import feedbackValidator from '../../middlewares/validateFeedback';
import validateRating from '../../middlewares/validateRating';

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

/**
 * @swagger
 *
 * /api/v1/accommodations?page={page}&limit={limit}&id={id}:
 *   get:
 *     security: []
 *     summary: Accommodation per destination
 *     description: show all available accommodation on your destination
 *     tags:
 *       - Accommodations
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
 *       - name: id
 *         description: request id.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: These are the available accomodations on your destination
 *  */
router.get('/', [checkUser, isProfileUpdated, validateParams], accommodationController.getAccommodationPerDestination);

/**
 * @swagger
 *
 * /api/v1/accommodations/book:
 *   post:
 *     security: []
 *     summary: Book accommodation
 *     description: Users can be able to book accommodations
 *     tags:
 *       - Accommodations
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accommodationId:
 *                 type: string
 *               roomId:
 *                 type: string
 *               tripId:
 *                 type: string
 *               checkIn:
 *                 type: string
 *               checkOut:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: You have successfully booked your accommodation
 */
router.post('/book', [checkUser, isProfileUpdated,
  isAccomendationExist,isRoomExist, isTripExist, 
  checkInAndCheckoutValidator, areYouTripOwner, 
  isRoomAlreadyBooked],
accommodationController.bookAccommodation);

 /**
 * @swagger
 *
 *  /api/v1/accommodations/feedback?accommodationId={accommodationId}:
 *   post:
 *     security: []
 *     summary: add a to accommodations
 *     description: add a comment to accommodations
 *     tags:
 *       - Accommodations
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feedback:
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
 *       - name: accommodationId
 *         description: accommodationId.
 *         in: path
 *         required: true
 *         default: id
 *         type: Thanks you for the feedback
 *     responses:
 *       200:
 *         description: Requests retrieved successfully
 *  */
router.post('/feedback', checkUser, validateId, feedbackValidator, accommodationController.feedback);

/**
 * @swagger
 *
 * /api/v1/accommodations/rating:
 *   post:
 *     security: []
 *     summary: rate accommodations
 *     description: rate accommodations
 *     tags:
 *       - Accommodations
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accommodationId:
 *                 type: string
 *               rating:
 *                 type: number
 *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Thank you for rating us
 */
router.post('/rating', [checkUser, validateRating], accommodationController.addRatings);

export default router;
