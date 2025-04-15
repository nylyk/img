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

export const formatSize = (bytes: number): string => {
  if (bytes > 1024 ** 2) {
    return `${(bytes / 1024 ** 2).toLocaleString('en', {
      maximumFractionDigits: 2,
    })} MiB`;
  } else if (bytes > 1024) {
    return `${(bytes / 1024).toLocaleString('en', {
      maximumFractionDigits: 2,
    })} KiB`;
  }
  return `${bytes} Bytes`;
};

export const formatTime = (seconds: number): string => {
  const units = [
    { label: 'year', short: 'Y', seconds: 31536000 },
    { label: 'month', short: 'mo', seconds: 2592000 },
    { label: 'week', short: 'w', seconds: 604800 },
    { label: 'day', short: 'd', seconds: 86400 },
    { label: 'hour', short: 'h', seconds: 3600 },
    { label: 'minute', short: 'min', seconds: 60 },
    { label: 'second', short: 's', seconds: 1 },
  ];

  let result = [];
  let remaining = seconds;

  for (const unit of units) {
    const unitValue = Math.floor(remaining / unit.seconds);
    if (unitValue > 0) {
      result.push(`${unitValue} ${unit.label}${unitValue > 1 ? 's' : ''}`);
      remaining %= unit.seconds;
    }

    if (result.length >= 2 || remaining === 0) {
      break;
    }
  }

  if (result.length === 2) {
    return `${result[0]} and ${result[1]}`;
  }
  return result[0] || '0 seconds';
};
