import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import { PUBLIC_DIR } from './constants/path.js';
import swaggerDocs from './middlewares/swaggerDocs.js';

const PORT = Number(env('PORT', '3000'));
export default function setupServer() {
  const app = express();

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  const corsOptions = {
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://your-production-frontend-domain.com'
        : 'http://localhost:5173',
    credentials: true,
  };

  app.use(cors(corsOptions));
  // app.use(cors());

  app.use(logger);
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.static(PUBLIC_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });
  app.use(router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
