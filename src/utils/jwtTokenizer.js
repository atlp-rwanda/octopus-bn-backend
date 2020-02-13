import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
   * @description encoding token method
   * @param {object} claims
   * @returns {string} token
   */
export const encode = (claims) => {
  const token = jwt.sign(claims, process.env.JWT_SECRET, { expiresIn: '7d' });
  return token;
};

/**
   * @description decoding token method
   * @param {string} token
   * @returns {object} payload
   */
export const decode = (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return payload;
};
