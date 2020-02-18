import { decode } from 'utils/jwtTokenizer';
import localStorage from 'localStorage';
import Models from '../database/models';

const { Users } = Models;
const checkUser = async (req, res, next) => {
  const Token = await localStorage.getItem('Token');
  if (!Token) {
    return res.status(403).json({
      status: 403,
      error: req.i18n.__('Pleaselog')
    });
  }
  const payload = decode(Token);
  const { email } = payload;
  const user = await Users.findOne({ where: { email } });
  const {
    isVerified
  } = user;
  if (!isVerified) {
    return res.status(403).json({
      status: 403,
      error: req.i18n.__('PleaseVerify')
    });
  }
  req.user = user;
  next();
};
export default checkUser;
