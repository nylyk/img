import { promises as fs } from 'fs';
import * as path from 'path';

import {
  idPattern,
  metaExtension,
  parsePostMeta,
  tempExtension,
} from '@/api/post/post.type.js';

import { cleanupIntervalSeconds, storagePath } from './env.js';

const isMetaExpiredOrInvalid = async (file: string): Promise<boolean> => {
  const id = path.basename(file, metaExtension);
  try {
    const meta = await fs.readFile(path.join(storagePath, file), 'utf8');
    return parsePostMeta(id, meta).expiresAt.getTime() < Date.now();
  } catch (_e) {
    console.log(`[Cleanup] Found invalid metadata file "${file}"`);
    return true;
  }
};

const isTempStale = async (file: string): Promise<boolean> => {
  const stats = await fs.stat(path.join(storagePath, file));
  return stats.mtimeMs < Date.now() - cleanupIntervalSeconds * 1000;
};

const findFilesToDelete = async (files: string[]): Promise<string[]> => {
  const fileSet = new Set(files);
  const filesToDelete: string[] = [];

  for (const file of files) {
    if (file.endsWith(metaExtension)) {
      if (await isMetaExpiredOrInvalid(file)) {
        filesToDelete.push(file, path.basename(file, metaExtension));
      }
    } else if (file.endsWith(tempExtension)) {
      if (await isTempStale(file)) {
        filesToDelete.push(file);
      }
    } else if (idPattern.test(file)) {
      if (!fileSet.has(file + metaExtension)) {
        filesToDelete.push(file);
      }
    } else {
      console.log(`[Cleanup] Found file with invalid name "${file}"`);
      filesToDelete.push(file);
    }
  }

  return filesToDelete;
};

const cleanup = async (): Promise<void> => {
  console.log(`[Cleanup] Starting cleanup in storage location ${storagePath}`);

  try {
    const files = await fs.readdir(storagePath);
    const filesToDelete = await findFilesToDelete(files);

    if (filesToDelete.length === 0) {
      console.log('[Cleanup] No expired or invalid files found');
      console.log('[Cleanup] Cleanup finished');
      return;
    }
    console.log(
      `[Cleanup] Found ${filesToDelete.length} expired or invalid file(s)`,
    );

    const results = await Promise.allSettled(
      filesToDelete.map((file) =>
        fs.rm(path.join(storagePath, file), { force: true }),
      ),
    );
    const rejected = results.filter((result) => result.status === 'rejected');

    console.log(
      `[Cleanup] Successfully deleted ${
        results.length - rejected.length
      } file(s)`,
    );

    if (rejected.length > 0) {
      rejected.forEach((result) =>
        console.error('[Cleanup] Failed to delete file', result.reason),
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
