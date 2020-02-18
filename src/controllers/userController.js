/* eslint-disable require-jsdoc */
import localStorage from 'localStorage';
import uuid from 'uuid/v4';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail, sendNotificationEmail, sendPasswordResetLink } from 'utils/emailHelper';
import { successResponse, errorResponse } from 'utils/responses';
import { encode, decode } from 'utils/jwtTokenizer';
import Models from '../database/models';
import i18n from '../utils/international';

/**
 * @description This class contains all the methods relating to the user
 * @class userController
 */
class userController {
  static async socialLogin(req, res) {
    try {
      const { Users } = Models;
      const isVerified = true;
      const password = 'null';
      const userID = req.user.id;
      const {
        email, firstName, lastName, method
      } = req.user;

      await Users.findOrCreate({
        where: { email },
        defaults: {
          userID,
          firstName,
          lastName,
          method,
          email,
          password,
          isVerified
        }
      });
      const Token = encode({
        email, firstName, lastName, method
      });
      localStorage.setItem('Token', Token);
      return res.status(200).json({
        status: 200,
        message: i18n.__('loginSuccessfully'),
        data: {
          email, userID, firstName, lastName, method, isVerified
        },
        Token
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        errors: {
          error
        }
      });
    }
  }

  static async logout(req, res) {
    localStorage.removeItem('Token', 0);
    return res.status(200).json({
      status: 200,
      message: i18n.__('outSuccessfully'),
    });
  }

  /**
     * @description user signUp method
     * @param {object} req
     * @param {object} res
     * @returns {object} newUser
     * @memberof userController
     */
  static async signUp(req, res) {
    try {
      const {
        firstName, lastName, email, password
      } = req.body;
      const hash = await bcrypt.hash(password, 10);
      const newUser = await Models.Users.create({
        userID: uuid(), method: 'local', firstName, lastName, email, password: hash, isVerified: false
      });
      const data = {
        userID: newUser.userID,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        isVerified: newUser.isVerified
      };
      const token = encode(data);
      const verificationData = {
        name: newUser.firstName, email: newUser.email, token
      };

      localStorage.setItem('Token', token);

      sendVerificationEmail(verificationData);

      return res.status(201).json({
        status: 201,
        message: i18n.__('signUpSuccess'),
        data,
        token
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      });
    }
  }

  /**
     * @description account verification
     * @param {object} req
     * @param {object} res
     * @returns {object} json
     * @memberof userController
     */
  static async verifyAccount(req, res) {
    // eslint-disable-next-line prefer-destructuring
    const token = req.params.token;
    const payload = decode(token);
    const emailExist = await Models.Users.findOne({ where: { email: payload.email } });

    if (!emailExist) {
      return res.status(404).json({
        status: 404,
        error: i18n.__('onVerifyFailure')
      });
    }

    if (emailExist.isVerified !== true) {
      await Models.Users.update(
        { isVerified: true }, { where: { email: payload.email } }
      );

      return res.status(200).json({
        status: 200,
        message: i18n.__('onVerifySuccess'),
        token
      });
    }

    return res.status(200).json({
      status: 200,
      message: i18n.__('onVerifySuccess')
    });
  }

  /**
     * @description update user roles
     * @param {object} req
     * @param {object} res
     * @returns {object} json
     * @memberof userController
     */
  static async assignRole(req, res) {
    const { role } = req.user;
    const userRole = req.body.role;
    const userExist = await Models.Users.findOne({ where: { email: req.body.email } });
    const errorMessage = 'You have to be loggen in as a super administrator to assign roles to users';

    if (!userExist) {
      return errorResponse(res, 404, 'The User you are assigning the role to don\'t exist');
    }

    if (role !== 'super_administrator') {
      return errorResponse(res, 401, errorMessage);
    }

    await Models.Users.update({ role: req.body.role },
      {
        where: { email: req.body.email }
      });

    sendNotificationEmail(userExist.firstName, userExist.email, userRole);

    return successResponse(res, 200, `Your role was upgraded to ${req.body.role}`);
  }


  static async signin(req, res) {
    try {
      const { email, password } = req.body,
        { Users } = Models,
        registered = await Users.findOne({
          where: {
            email,
          },
        });

      if (!registered) {
        return res.status(401).json({
          status: 401,
          error: i18n.__('IncorrectEmailPassword'),
        });
      }

      const { method } = registered;
      if (method !== 'local') {
        return res.status(422).json({
          status: 422,
          error: `Please use ${registered.method} to sign in`
        });
      }

      const truePassword = await bcrypt.compareSync(password, registered.password);

      if (!truePassword) {
        return res.status(401).json({
          status: 401,
          error: i18n.__('IncorrectEmailPassword'),
        });
      }
      const token = encode({
        email
      });
      localStorage.setItem('Token', token);
      return res.status(200).json({
        status: 200,
        message: i18n.__('localLoginSuccess'),
        token
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: req.i18n.__('internalServerError')
      });
    }
  }

  /**
       * @description forgot password
       * @param {object} req
       * @param {object} res
       * @returns {object} json
       * @memberof userController
       */

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body,
        { Users } = Models,
        registered = await Users.findOne({
          where: {
            email,
          },
        });

      if (!registered) {
        return res.status(404).json({
          status: 404,
          error: req.i18n.__('onVerifyFailure')
        });
      }

      const token = encode({ email });
      const user = {
        name: registered.firstName, email: registered.email, token
      };

      sendPasswordResetLink(user, req.headers.host);
      return res.status(200).json({
        status: 200,
        message: req.i18n.__('emailSent')
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: req.i18n.__('internalServerError')
      });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { password, confirmPassword } = req.body,
        { token } = req.params,
        payload = decode(token),
        registered = await Models.Users.findOne({ where: { email: payload.email } });

      if (!registered) {
        return res.status(404).json({
          status: 404,
          error: req.i18n.__('onVerifyFailure')
        });
      }

      if (password !== confirmPassword) {
        return res.status(422).json({
          status: 422,
          error: req.i18n.__('passwordsDontMatch')
        });
      }
      const hash = await bcrypt.hash(password, 10);

      await Models.Users.update(
        { password: hash }, { where: { email: payload.email } }
      );

      return res.status(200).json({
        status: 200,
        message: req.i18n.__('passwordReset')
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: i18n.__('internalServerError')
      });
    }
  }

  /**
     * @description profile settings method
     * @param {object} req
     * @param {object} res
     * @returns {object} updated record
     * @memberof userController
     */
  static async updateProfile(req, res) {
    try {
      const { body, user } = req;
      const { userID } = user;
      const {
        firstName,
        lastName,
        gender,
        birthDate,
        preferedLang,
        preferedCurrency,
        residence,
        department,
        managerEmail,
        imageUrl,
        bio,
        passportNumber
      } = body;
      const result = await Models.Users.update(
        {
          firstName,
          lastName,
          gender,
          birthDate,
          preferedLang,
          preferedCurrency,
          residence,
          department,
          managerEmail,
          imageUrl,
          bio,
          passportNumber
        }, {
          where: { userID },
          returning: true,
          plain: true
        }
      );

      return res.status(200).json({
        status: 200,
        message: i18n.__('ProfileUpdated'),
        data: result[1]
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: i18n.__('internalServerError')
      });
    }
  }
}

export default userController;
