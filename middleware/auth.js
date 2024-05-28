import jwt from 'jsonwebtoken';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

const AUTH_ERROR = { message: 'Authentication failed' };

export const isAuth = async (req, res, next) => {
  let token;
  const authHeader = req.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  if (!token) {
    token = req.cookies['token'];
  }
  if (!token) {
    return res.status(401).json(AUTH_ERROR);
  }
  try {
    let payload = jwt.verify(token, config.jwt.secretKey);
    const user = await userRepository.findById(payload.userId);
    req.userId = user.id; // req.customData 리퀘스트에 커스텀 데이터 등록
    req.token = token;
    next();
  } catch (e) {
    return res.status(401).json(AUTH_ERROR);
  }
};

export const authHandler = async (req) => {
  const authHeader = req.get('Authorization');
  const token = authHeader.split(' ')[1];
  try {
    console.log(token, config.jwt.secretKey);
    let payload = jwt.verify(token, config.jwt.secretKey);
    console.log(`payload is ${payload}`);
    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw { status: 401, ...AUTH_ERROR };
    }
    req.userId = user.id; // req.customData 리퀘스트에 커스텀 데이터 등록
    req.token = payload;
    return true;
  } catch (err) {
    console.log(err);
    throw { status: 401, ...AUTH_ERROR };
  }
};
