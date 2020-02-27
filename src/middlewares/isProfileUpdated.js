
const isProfileUpdated = async (req, res, next) => {
  const { isUpdated } = req.user;
  if (!isUpdated) {
    return res.status(403).json({
      status: 403,
      error: req.i18n.__('PleaseUpdateProfile')
    });
  }
  next();
};
export default isProfileUpdated;
