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
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full mt-2 pb-5 border-b border-zinc-300 dark:border-zinc-700/80">
      <div className="px-2 py-1 rounded-lg border inset-shadow-xs break-all bg-zinc-200/75 border-zinc-300 dark:bg-zinc-800/75 dark:border-zinc-700/50">
        <Link to={url}>{url}</Link>
      </div>
      <button
        className="w-full mt-3 p-3 rounded-lg cursor-pointer shadow hover:brightness-95 bg-blue-600/75 dark:bg-blue-500/90 text-white"
        onClick={onCopy}
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
};

export default CopyableLink;
