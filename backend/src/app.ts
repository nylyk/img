import * as path from 'path';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { PORT } from './env.js';
import router from './router.js';
import errorHandler from './middleware/errorHandler.js';

const bootstrap = () => {
  const app = express();

  app.use(helmet());
  app.use(morgan('tiny', {}));
  app.use(express.json());

  app.use(router);

  if (process.env.NODE_ENV === 'production') {
    const frontendRoot = '/frontend/dist';
    app.use(express.static(frontendRoot));
    app.use((_req, res) => {
      res.sendFile(path.join(frontendRoot, 'index.html'));
    });
  }

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
bootstrap();
