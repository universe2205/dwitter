import jwt from 'jsonwebtoken';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

const AUTH_ERROR = { message: 'Authentication failed' };

export const isAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!(authHeader && authHeader.startsWith('Bearer '))) {
    return res.status(401).json(AUTH_ERROR);
  }
  const token = authHeader.split(' ')[1];
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
