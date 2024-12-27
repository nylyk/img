const env = process.env;

export const port = env.PORT ?? '3000';

export const footerText =
  env.FOOTER ??
  'img - Simple, fast, end-to-end encrypted, temporary image sharing.';

const POST_MAX_SIZE_BYTES = env.POST_MAX_SIZE_BYTES ?? '52428800'; // 50MiB
const POST_EXPIRE_TIMES_SECONDS =
  env.POST_EXPIRE_TIMES_SECONDS ?? '3600,86400,604800,2592000'; // 1 hour, 1 day, 7 days, 30 days
const POST_DEFAULT_EXPIRE_TIME_SECONDS =
  env.POST_DEFAULT_EXPIRE_TIME_SECONDS ?? '86400'; // 1 day

export const maxSizeBytes = parseInt(POST_MAX_SIZE_BYTES);
export const expireTimesSeconds = POST_EXPIRE_TIMES_SECONDS.split(',')
  .map((time) => parseInt(time))
  .filter((time) => time > 60)
  .sort((a, b) => a - b);
export const defaultExpireTimeSeconds = parseInt(
  POST_DEFAULT_EXPIRE_TIME_SECONDS
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
      'POST_DEFAULT_EXPIRE_TIME_SECONDS must be a value from POST_EXPIRE_TIMES_SECONDS'
    );
    isValid = false;
  }

  return isValid;
};
