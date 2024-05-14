import dotenv from 'dotenv';
dotenv.config();

function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  jwt: {
    secretKey: required('JWT_SECRET_KEY'),
    ExpiresIn: parseInt(required('JWT_EXPIRES_IN', 86400)),
  },
  bcrypt: {
    SaltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 12)),
  },
  port: {
    port: parseInt(required('PORT', 8080)),
  },
  db: {
    host: required('DB_HOST'),
  },
  cors: {
    allowedOrigin: required('CORS_ALLOWED_ORIGIN'),
  },
  csrf: {
    plainToken: required('CSRF_SECRET_KEY'),
  },
};
