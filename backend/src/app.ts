import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import * as path from 'path';

import errorHandler from './middleware/errorHandler.js';
import router from './router.js';
import { startCleanupInterval } from './utils/cleanup.js';
import { maxSizeBytes, port, validateEnvironment } from './utils/env.js';

const bootstrap = () => {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: { 'img-src': "'self' blob: data:", 'media-src': 'blob:' },
      },
    }),
  );
  app.use(morgan('tiny'));
  app.use(express.json({ limit: maxSizeBytes * 1.5 }));

  app.use(router);

  if (process.env.NODE_ENV === 'production') {
    const frontendRoot = '/frontend/dist';
    app.use(express.static(frontendRoot));
    app.use((_req, res) => {
      res.sendFile(path.join(frontendRoot, 'index.html'));
    });
  }

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

if (validateEnvironment()) {
  bootstrap();
  startCleanupInterval();
}
