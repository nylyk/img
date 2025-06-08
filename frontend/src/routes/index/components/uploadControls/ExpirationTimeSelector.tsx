import { ChevronDown } from 'lucide-react';
import { FC } from 'react';

import { formatTime } from '@/utils/utils';

const ExpirationTimeSelector: FC<{
  expireTimesSeconds: number[];
  defaultExpireTimeSeconds: number;
  disabled: boolean;
  onChange: (selectedExpireTime: number) => void;
}> = ({ expireTimesSeconds, defaultExpireTimeSeconds, disabled, onChange }) => {
  return (
    <div className="mb-4 w-full">
      <span className="mb-0.5 inline-block text-sm text-zinc-500 dark:text-zinc-400">
        Expires in
      </span>
      <div className="relative w-full">
        <select
          className="w-full cursor-pointer appearance-none rounded-md bg-white px-4 py-2 shadow-sm ring-1 ring-zinc-200 outline-none hover:ring-2 hover:ring-emerald-500 focus:ring-2 focus:ring-emerald-500 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:ring-emerald-400 dark:focus:ring-emerald-400"
          defaultValue={defaultExpireTimeSeconds}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          {expireTimesSeconds.map((time) => (
            <option key={time} value={time}>
              {formatTime(time)}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
          <ChevronDown size={20} className="text-zinc-500 dark:text-zinc-400" />
        </div>
      </div>
    </div>
  );
};

export default ExpirationTimeSelector;
