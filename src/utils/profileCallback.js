import Models from '../database/models';
import { encode, decode } from 'utils/jwtTokenizer';

const profileCallback = async (accessToken, refreshToken, profile, cb) => {
  const method = profile.provider;
  const { id } = profile;
  const firstName = profile.name.firstName || profile.name.givenName;
  const lastName = profile.name.lastName || profile.name.familyName;
  const email = profile.emails[0].value;
  const password = 'null';
  const { Users } = Models;
  try {
   const user = await Users.findOrCreate({
      where: { email },
      defaults: {
        id,
        firstName,
        lastName,
        method,
        email,
        password,
        isVerified: true,
        isUpdated: false
      }
    });
    const Token = encode({
      email,
      firstName,
      lastName,
      method
    });
    user.push(Token);
    return cb(null, user);
  } catch (error) {
    return cb(null, error);
  }
};

export default profileCallback;
