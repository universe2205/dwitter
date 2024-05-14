import { config } from '../config.js';
import bcrypt from 'bcrypt';

export const csrfCheck = (req, res, next) => {
  if (req.method === 'GET' || req.method === 'OPTIONS' || req.method === 'HEAD') {
    return next();
  }
  const csrfHeader = req.get('dwitter-csrf-token');
  console.log(csrfHeader);

  if (!csrfHeader) {
    console.warn('Missing required "dwitter-csrf-token" header.', req.headers.origin);
    return res.status(403).json({ message: 'Failed CSRF check.' });
  }

  validateCsrfToken(csrfHeader) //
    .then((valid) => {
      if (!valid) {
        console.warn('Value provided in "dwitter-csrf-token" header is invalid.', req.headers.origin, csrfHeader);
        return res.status(403).json({ message: 'Failed CSRF check.' });
      }
      next();
    }) //
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: 'something went wrong' });
    });
};

async function validateCsrfToken(csrfHeader) {
  return bcrypt.compare(config.csrf.plainToken, csrfHeader);
}
