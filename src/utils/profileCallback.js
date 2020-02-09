const profileCallback = async (accessToken, refreshToken, profile, cb) => {
  const method = profile.provider;
  const { id } = profile;
  const firstName = profile.name.firstName || profile.name.givenName;
  const lastName = profile.name.lastName || profile.name.familyName;
  const email = profile.emails[0].value;
  const user = {
    id, method, firstName, lastName, email
  };
  return cb(null, user);
};

export default profileCallback;
