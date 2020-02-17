
import localStorage from 'localStorage';

/**
 *
 * @param {object} req
 * @param {object} res
 * @returns {object}
 */

const isLoggedIn = (req, res) => {
  const Token = localStorage.getItem('Token');
  if (Token) {
    return res.status(200).json({
      message: req.i18n.__('Welcome')
    });
  }
  return res.status(200).json({
    message: req.i18n.__('InWelcome')
  });
};

export default isLoggedIn;
