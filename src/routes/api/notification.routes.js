import express from 'express';
import checkUser from 'middlewares/checkUser';
import validation from 'validation/user.validation';
import notificationController from '../../controllers/notification';

const {
  notifyByEmail,
  validateResult,
} = validation;

const router = express.Router();

/**
 * @swagger
 *
 * /api/v1/notifications/preferences:
 *   put:
 *     security: []
 *     summary: Update User preferences on notifications
 *     description: Update User preferences on notifications
 *     tags:
 *       - Notifications
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notifyByEmail:
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
 *     responses:
 *       200:
 *         description: Update User preferences on notifications
 *  */
router.put('/preferences', [checkUser, notifyByEmail, validateResult], notificationController.changePreferrence);
/**
 * @swagger
 *
 * /api/v1/notifications/:
 *   get:
 *     security: []
 *     summary: Get all notifications
 *     description: Get all notifications
 *     tags:
 *       - Notifications
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
 *       200:
 *         description: Get all notifications
 *  */
router.get('/', checkUser, notificationController.getAllNotifications);
/**
 * @swagger
 *
 * /api/v1/notifications/unread:
 *   get:
 *     security: []
 *     summary: get unread notifications
 *     description: get unread notifications
 *     tags:
 *       - Notifications
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
 *       200:
 *         description: get unread notifications
 *  */
router.get('/unread', checkUser, notificationController.unReadNotifications);

router.get('/static', checkUser, (req, res) => {
  const {
    user,
    headers: { host }
  } = req;
  res.render('notification', { user, host });
});

export default router;
