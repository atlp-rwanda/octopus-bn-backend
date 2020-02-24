import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import profileCallback from '../utils/profileCallback';


dotenv.config();


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
passport.use('google', new GoogleStrategy({
  name: 'google',
  clientID: process.env.GOOGLE_APP_ID,
  clientSecret: process.env.GOOGLE_APP_SECRET,
  callbackURL: `${process.env.SERVER_API_URL}/api/v1/auth/google/callback`,
  profileFields: ['id', 'emails', 'name'],
}, profileCallback));


passport.use('facebook', new FacebookStrategy({
  name: 'facebook',
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${process.env.SERVER_API_URL}/api/v1/auth/facebook/callback`,
  profileFields: ['id', 'emails', 'name', 'gender'],
}, profileCallback));


export default passport;
