import setLanguage from '../utils/international';

const isTravelAdministrator = (req, res, next) => {
  const { role, preferedLang } = req.user;
  if (role !== 'travel_administrator') {
    return res.status(403).json({
      status: 403,
      error: setLanguage(preferedLang).__('PleaseShouldManager')
    });
  }
  next();
};
export default isTravelAdministrator;
