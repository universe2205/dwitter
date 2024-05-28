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

router.post('/login', validateCredential, authController.login);

router.post('/logout', authController.logout);

router.get('/me', isAuth, authController.me);

router.get('/csrf_token', authController.csrfToken);

export default router;
