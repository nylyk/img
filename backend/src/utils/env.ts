const env = process.env;

export const port = env.PORT ?? '3000';

export const storagePath = env.STORAGE_PATH ?? '/data';

export const cleanupIntervalSeconds = parseInt(
  env.CLEANUP_INTERVAL_SECONDS ?? '300'
);

export const footerText =
  env.FOOTER ??
  'img - Simple, fast, end-to-end encrypted, temporary image sharing.';

export const maxSizeBytes = parseInt(env.POST_MAX_SIZE_BYTES ?? '52428800');

const expireTimesStr =
  env.POST_EXPIRE_TIMES_SECONDS ?? '3600,86400,604800,2592000';
export const expireTimesSeconds = expireTimesStr
  .split(',')
  .map((time) => parseInt(time))
  .filter((time) => time >= 60)
  .sort((a, b) => a - b);

export const defaultExpireTimeSeconds = parseInt(
  env.POST_DEFAULT_EXPIRE_TIME_SECONDS ?? '86400'
);

export const validateEnvironment = (): boolean => {
  let isValid = true;

  if (maxSizeBytes < 1024) {
    console.error('POST_MAX_SIZE_BYTES must at least be 1024');
    isValid = false;
  }
  if (expireTimesSeconds.length === 0) {
    console.error(
      'POST_EXPIRE_TIMES_SECONDS must at least have one entry of at least 60'
    );
    isValid = false;
  }
  if (!expireTimesSeconds.includes(defaultExpireTimeSeconds)) {
    console.error(
      'POST_DEFAULT_EXPIRE_TIME_SECONDS must be one of POST_EXPIRE_TIMES_SECONDS'
    );
    isValid = false;
  }
  if (cleanupIntervalSeconds < 10) {
    console.error('POST_CLEANUP_INTERVAL_SECONDS must at least be 10');
    isValid = false;
  }

  return isValid;
};
