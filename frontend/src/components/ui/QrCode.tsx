import qrcode from 'qrcode';
import { FC, useEffect, useRef } from 'react';

import useTheme from '@/hooks/useTheme';

const QrCode: FC<{ text: string }> = ({ text }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [theme] = useTheme();

  useEffect(() => {
    if (canvasRef.current) {
      qrcode.toCanvas(canvasRef.current, text, {
        margin: 3,
        width: 172,
        color: {
          dark: theme === 'dark' ? '#000000' : '#15151b',
          light: theme === 'dark' ? '#e2e2e3' : '#fcfcfd',
        },
      });
    }
  }, [text, theme]);

  return (
    <div className="mb-3 hidden w-full lg:block">
      <canvas
        ref={canvasRef}
        className="mx-auto rounded-lg border border-zinc-300 [image-rendering:pixelated]"
      />
    </div>
  );
};

export default QrCode;
