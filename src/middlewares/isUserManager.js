import setLanguage from '../utils/international';

const isUserManager = (req, res, next) => {
  const { role, preferedLang } = req.user;
  if (role !== 'manager') {
    return res.status(403).json({
      status: 403,
      error: setLanguage(preferedLang).__('PleaseShouldManager')
    });
  }
  next();
};
export default isUserManager;
