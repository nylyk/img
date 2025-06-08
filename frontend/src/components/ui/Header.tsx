import { Moon, Sun } from 'lucide-react';

import useTheme from '@/hooks/useTheme';

const Header = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <header className="mx-5 my-4 flex items-center justify-between">
      <a className="font-mono text-4xl" href="/">
        img
      </a>
      <div
        className="cursor-pointer rounded-full p-1.5 text-zinc-600 transition-colors hover:bg-zinc-500/15 hover:text-inherit dark:text-zinc-400"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? <Sun /> : <Moon />}
      </div>
    </header>
  );
};

export default Header;
