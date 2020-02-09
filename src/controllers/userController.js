/* eslint-disable require-jsdoc */
import localStorage from 'localStorage';
import Models from '../database/models';
import { encode } from '../utils/jwtTokenizer';

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
}


export default userController;
