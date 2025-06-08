import useFetch from '../../hooks/useFetch';
import { api } from 'common';

const Footer = () => {
  const [data, error] = useFetch<api.Footer>('/api/footer');

  return (
    <footer className="m-5 flex flex-col items-center gap-1 text-sm text-zinc-800 lg:m-7 lg:flex-row lg:justify-between dark:text-zinc-500">
      <span className="text-center">{data?.text}</span>
      <div className="flex gap-4">
        {data?.links.map((link) => (
          <a
            className="underline-offset-2 hover:underline"
            href={link.url}
            key={link.url}
          >
            {link.title}
          </a>
        ))}
        <a
          className="underline-offset-2 hover:underline"
          href="https://github.com/nylyk/img"
        >
          Source
        </a>
      </div>
    </footer>
  );
};

export default Footer;
