import setLanguage from '../utils/international';

const isProfileUpdated = async (req, res, next) => {
  const { isUpdated, preferedLang } = req.user;
  if (!isUpdated) {
    return res.status(403).json({
      status: 403,
      error: setLanguage(preferedLang).__('PleaseUpdateProfile')
    });
  }
  next();
};
export default isProfileUpdated;
