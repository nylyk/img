import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const formatSize = (sizeBytes: number): string => {
  if (sizeBytes > 1024 ** 2) {
    return `${(sizeBytes / 1024 ** 2).toLocaleString('en', {
      maximumFractionDigits: 2,
    })} MiB`;
  } else if (sizeBytes > 1024) {
    return `${(sizeBytes / 1024).toLocaleString('en', {
      maximumFractionDigits: 2,
    })} KiB`;
  }
  return `${sizeBytes} Bytes`;
};
