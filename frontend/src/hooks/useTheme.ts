import { useLocalStorage } from '@uidotdev/usehooks';
import { useCallback, useMemo } from 'react';

const useTheme = (): ['light' | 'dark', () => void] => {
  const [storedTheme, setTheme] = useLocalStorage('theme', 'light');
  const theme = useMemo(
    () => (storedTheme === 'dark' ? 'dark' : 'light'),
    [storedTheme],
  );

  const toggleTheme = useCallback(() => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, [theme, setTheme]);

  return [theme, toggleTheme];
};

export default useTheme;
