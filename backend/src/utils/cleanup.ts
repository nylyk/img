import { promises as fs } from 'fs';
import * as path from 'path';
import { cleanupIntervalSeconds, storagePath } from './env.js';
import { filenameToPost } from '../api/post/post.type.js';

const cleanup = async (): Promise<void> => {
  console.log(`[Cleanup] Starting cleanup in storage location ${storagePath}`);

  try {
    const now = Date.now();
    const files = await fs.readdir(storagePath);
    const filesToDelete = files
      .map((file) => {
        try {
          const post = filenameToPost(file);
          if (post.expiresAt.getTime() < now) {
            return file;
          }
        } catch (_e) {
          console.log(`[Cleanup] Found file with invalid name "${file}"`);
          return file;
        }
      })
      .filter((file): file is string => Boolean(file));

    if (filesToDelete.length === 0) {
      console.log('[Cleanup] No expired or invalid files found');
      console.log('[Cleanup] Cleanup finished');
      return;
    }
    console.log(
      `[Cleanup] Found ${filesToDelete.length} expired or invalid file(s)`
    );

    const results = await Promise.allSettled(
      filesToDelete.map((file) => fs.rm(path.join(storagePath, file)))
    );
    const rejected = results.filter((result) => result.status === 'rejected');

    console.log(
      `[Cleanup] Successfully deleted ${
        results.length - rejected.length
      } file(s)`
    );

    if (rejected.length > 0) {
      rejected.forEach((result) =>
        console.error('[Cleanup] Failed to delete file', result.reason)
      );
      console.error(`[Cleanup] Failed to delete ${rejected.length} file(s)`);
    }

    console.log('[Cleanup] Cleanup finished');
  } catch (err) {
    console.error('[Cleanup] Failed to access storage location', err);
    throw err;
  }
};

export const startCleanupInterval = () => {
  cleanup();
  setInterval(cleanup, cleanupIntervalSeconds * 1000);
};
