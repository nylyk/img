import { useLocalStorage, useMediaQuery } from '@uidotdev/usehooks';
import { FC, PropsWithChildren, useEffect } from 'react';

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, _] = useLocalStorage('theme', prefersDark ? 'dark' : 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return children;
};

export default ThemeProvider;
