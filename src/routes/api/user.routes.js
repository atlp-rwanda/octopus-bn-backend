import express from 'express';
import passport from 'passport';
import 'config/passport';
import userController from 'controllers/userController';
import validation from 'validation/user.validation';

const router = express.Router();
const {
  checkFirstName, checkLastName, checkValidEmail, checkExistingEmail, checkPassword, validateResult
} = validation;

router.use(passport.initialize());

/**
 * @swagger
 *
* /api/v1/auth/facebook:
*   get:
*     security: []
*     summary: Facebook sign in
*     description: Get infomation from facebook and use it to signin a user
*     tags:
*       - Users
*     produces:
*         application/json:
*           schema:
*             type: object
*             properties:
*               status:
*                 type: string
*               message:
*                 type: string
*               data:
*                 type: object
*                 properties:
*                   userID:
*                     type: integer
*                   firstName:
*                     type: string
*                   lastName:
*                     type: string
*                   email:
*                     type: string
*                 Token:
*                   type: string
*     responses:
*       200:
*         description: User login successfully
*/
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email'],
  session: false
}));


router.get('/facebook/callback', passport.authenticate('facebook', {
  // failureRedirect: process.env.FRONT_END_FAIL_REDIRECT,
// successRedirect: process.env.FRONT_END_SUCCESS_REDIRECT,
}), userController.socialLogin);

/**
 * @swagger
 *
* /api/v1/auth/google:
*   get:
*     security: []
*     summary: Google sign in
*     description: Get infomation from Google and use it to signin a user
*     tags:
*       - Users
*     produces:
*         application/json:
*           schema:
*             type: object
*             properties:
*               status:
*                 type: string
*               message:
*                 type: string
*               data:
*                 type: object
*                 properties:
*                   userID:
*                     type: integer
*                   firstName:
*                     type: string
*                   lastName:
*                     type: string
*                   email:
*                     type: string
*                 Token:
*                   type: string
*     responses:
*       200:
*         description: User login successfully
*/
router.get('/google', passport.authenticate('google', {
  session: false,
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
}));


router.get('/google/callback', passport.authenticate('google', {
  // failureRedirect: process.env.FRONT_END_FAIL_REDIRECT,
  // successRedirect: process.env.FRONT_END_SUCCESS_REDIRECT,
}), userController.socialLogin);

/**
 * @swagger
 *
 * /api/v1/auth/signup:
 *   post:
 *     security: []
 *     summary: User registration
 *     description: Register new users and verify their account via email
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
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
 *                   userID:
 *                     type: integer
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *     responses:
 *       201:
 *         description: created
 */
router.post('/signup', checkFirstName, checkLastName, checkValidEmail, checkExistingEmail, checkPassword, validateResult, userController.signUp);
router.get('/verify/:token', userController.verifyAccount);

export default router;
