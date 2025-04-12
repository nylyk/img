import useFetch from '../../hooks/useFetch';
import { api } from 'common';

const Footer = () => {
  const [data, error] = useFetch<api.Footer>('/api/footer');

  return (
    <footer className="m-5 lg:m-7 flex flex-col lg:flex-row lg:justify-between items-center gap-1 text-sm text-zinc-800 dark:text-zinc-500">
      <span className="text-center">{data?.text}</span>
      <div className="flex gap-4">
        {data?.links.map((link) => (
          <a className="hover:underline underline-offset-2" href={link.url}>
            {link.title}
          </a>
        ))}
        <a
          className="hover:underline underline-offset-2"
          href="https://github.com/nylyk/img"
        >
          Source
        </a>
      </div>
    </footer>
  );
};

export default Footer;
