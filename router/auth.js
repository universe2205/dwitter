import express from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import * as authController from '../controller/auth.js';
import { isAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

const validateCredential = [
  body('username').trim().notEmpty().withMessage('username is required'),
  body('password').trim().isLength({ min: 5 }).withMessage('password should be at least 5 characters'),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body('name').trim().notEmpty().withMessage('name is required'),
  body('email').trim().isEmail().withMessage('email is not valid'),
  body('url').trim().isURL().withMessage('url is not valid').optional({ nullable: true, checkFalsy: true }),
  validate,
];

router.post('/signup', validateSignup, authController.signup);

router.post('/login', validateCredential, authController.login);

router.get('/me', isAuth, authController.me);

export default router;
