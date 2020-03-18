import setLanguage from '../utils/international';

const isTravelAdministrator = (req, res, next) => {
  const { role, preferedLang } = req.user;
  if (role !== 'travel_administrator' && role !== 'accommodation_supplier') {
    return res.status(403).json({
      status: 403,
      error: setLanguage(preferedLang).__('PleaseOnly')
    });
  }
  next();
};
export default isTravelAdministrator;
