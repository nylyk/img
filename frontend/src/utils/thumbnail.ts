import { MediaFile } from './post';

const render = (image: HTMLImageElement | HTMLVideoElement): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 64;
  canvas.height = 64;

  let originalWidth: number;
  let originalHeight: number;
  if (image instanceof HTMLVideoElement) {
    originalWidth = image.videoWidth;
    originalHeight = image.videoHeight;
  } else {
    originalWidth = image.naturalWidth;
    originalHeight = image.naturalHeight;
  }

  const scale = Math.max(
    canvas.width / originalWidth,
    canvas.height / originalHeight,
  );

  const scaledWidth = originalWidth * scale;
  const scaledHeight = originalHeight * scale;

  const dx = (canvas.width - scaledWidth) / 2;
  const dy = (canvas.height - scaledHeight) / 2;

  ctx?.drawImage(image, dx, dy, scaledWidth, scaledHeight);

  return canvas.toDataURL('image/jpeg', 0.7);
};

export const renderThumbnail = (file: MediaFile): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.blob.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        resolve(render(img));
      };
      img.src = file.url;
    } else if (file.blob.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        video.currentTime = video.duration * 0.1;
      };
      video.onseeked = () => {
        resolve(render(video));
      };
      video.src = file.url;
    } else {
      reject('Wrong media format');
    }
  });
};
