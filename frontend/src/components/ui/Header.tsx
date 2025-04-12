import { Moon, Sun } from 'lucide-react';
import useTheme from '../../hooks/useTheme';
import { Link } from 'wouter';

const Header = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <header className="mx-5 my-4 flex justify-between items-center">
      <Link className="font-mono text-4xl" to="/">
        img
      </Link>
      <div
        className="p-1.5 cursor-pointer rounded-full transition-colors text-zinc-600 dark:text-zinc-400 hover:text-inherit hover:bg-zinc-500/15"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? <Moon /> : <Sun />}
      </div>
    </header>
  );
};

export default Header;
