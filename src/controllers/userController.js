/* eslint-disable require-jsdoc */
import localStorage from 'localStorage';
import uuid from 'uuid/v4';
import bcrypt from 'bcryptjs';
import sendVerificationEmail from 'utils/email.helper';
import { encode, decode } from 'utils/jwtTokenizer';
import Models from '../database/models';


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
        message: req.i18n.__('loginSuccessfully'),
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

      sendVerificationEmail(verificationData);

      return res.status(201).json({
        status: 201,
        message: req.i18n.__('signUpSuccess'),
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
        error: req.i18n.__('onVerifyFailure')
      });
    }

    if (emailExist.isVerified !== true) {
      await Models.Users.update(
        { isVerified: true }, { where: { email: payload.email } }
      );

      return res.status(200).json({
        status: 200,
        message: req.i18n.__('onVerifySuccess'),
        token
      });
    }

    return res.status(200).json({
      status: 200,
      message: req.i18n.__('onVerifySuccess')
    });
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
          error: req.i18n.__('IncorrectEmailPassword'),
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
          error: req.i18n.__('IncorrectEmailPassword'),
        });
      }

      // const { UserID } = registered;
      // const token = serialize(email, UserID);
      // res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
      const token = encode({
        email
      });
      localStorage.setItem('Token', token);
      return res.status(200).json({
        status: 200,
        message: req.i18n.__('localLoginSuccess'),
        token
      });
    } catch (error) {
      /**
         * This for the developer to know the problem while
         * scanning user logs
         */
      return res.status(200).json({
        status: 500,
        error: req.i18n.__('internalServerError')
      });
    }
  }
}

export default userController;
