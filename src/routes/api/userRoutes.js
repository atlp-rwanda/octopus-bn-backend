import express from 'express';
import validation from '../../validation/user.validation';

const router = express.Router();
const {
  checkFirstName, checkLastName, checkValidEmail, checkExistingEmail, checkPassword, validateResult
} = validation;

router.post('/signup', checkFirstName, checkLastName, checkValidEmail, checkExistingEmail, checkPassword, validateResult);

export default router;
