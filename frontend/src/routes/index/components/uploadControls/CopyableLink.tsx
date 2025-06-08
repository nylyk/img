import { FC, useState } from 'react';
import { Link } from 'wouter';

const CopyableLink: FC<{ id: string; password: string }> = ({
  id,
  password,
}) => {
  const [copied, setCopied] = useState(false);

  const url = `${location.origin}/${id}#${password}`;

  const onCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  return (
    <div className="mt-2 mb-4 w-full border-b border-zinc-300 pb-5 dark:border-zinc-700/80">
      <div className="rounded-lg border border-zinc-300 bg-zinc-200/75 px-2 py-1 break-all inset-shadow-xs dark:border-zinc-700/50 dark:bg-zinc-800/75">
        <Link to={url}>{url}</Link>
      </div>
      <button
        className="mt-3 w-full cursor-pointer rounded-lg bg-blue-600/75 p-3 text-white shadow hover:brightness-95 dark:bg-blue-500/90"
        onClick={onCopy}
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
};

export default CopyableLink;
