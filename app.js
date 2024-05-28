import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import tweetsRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import { config } from './config.js';
import { initSocket } from './connection/socket.js';
import { connectDB } from './db/database.js';
import { csrfCheck } from './middleware/csrf.js';
import rateLimit from './middleware/rate-limiter.js';
import yaml from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import * as OpenAPIValidator from 'express-openapi-validator';
import * as apis from './controller/index.js';
import { authHandler } from './middleware/auth.js';

const app = express();

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true,
};

const openAPIDocument = yaml.load('./api/openapi.yaml');

app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan('tiny'));
app.use(rateLimit);

app.get('/', (req, res) => {
  res.sendStatus(200);
  console.log('home');
});
app.use(csrfCheck);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openAPIDocument));
app.use('/tweets', tweetsRouter);
app.use('/auth', authRouter);
app.use(
  OpenAPIValidator.middleware({
    apiSpec: './api/openapi.yaml',
    validateResponses: true,
    operationHandlers: {
      resolver: modulePathResolver,
    },
    validateSecurity: {
      handlers: {
        jwt_auth: authHandler,
      },
    },
  })
);

function modulePathResolver(_, route, apiDoc) {
  const pathKey = route.openApiRoute.substring(route.basePath.length);
  const operation = apiDoc.paths[pathKey][route.method.toLowerCase()];
  const methodName = operation.operationId;
  return apis[methodName];
}

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message,
  });
});

connectDB()
  .then((db) => {
    console.log(`Server is started.... ${new Date()}`);
    const server = app.listen(config.port);
    initSocket(server);
  })
  .catch(console.error);
